import axios from 'axios'
import { EventEmitter } from 'eventemitter3'
import SocketConnect from './connect'
import { NetConfig } from './IMType'

export default class IM extends EventEmitter {
  /** 实例 */
  static instance: IM
  /** 网路配置 */
  private net: NetConfig

  private token?: string
  /** 用户信息 */
  private logger?: any
  private name?: string

  private loginLock = false
  private event?: any

  public socket: any //websocket实例
  private reconnectCount = 0 // 连接次数
  private reconnectLock = false

  static init(url: string, name: string) {
    if (!this.instance) {
      return new IM(url, name)
    }
    return this.instance
  }

  constructor(url: string, name: string) {
    super()
    this.net = new URL(url)
    this.net.ssl = url.startsWith('https')
    this.name = name
    this.event = new EventEmitter()

    this.tryLogin()
    this.connect = this.connect.bind(this)
    this.event.on('up-token', this.connect)
  }

  private tryLogin() {
    try {
      this.login()
    } catch (error) {
      this.loginLock = false
      this.event.emit('login-error', error)
    }
  }

  /**
   * 登录验证
   * @returns
   */
  private async login() {
    // 禁止重复登陆
    if (this.loginLock) return
    const response = await axios.post(this.net.href + 'login', { name: this.name })
    const data = response.data
    if (data.code === 1) {
      this.token = data.token
      this.logger = data.data
      this.loginLock = true
      // 更新token
      this.event.emit('up-token', data.token)
    }
  }

  private connect(token: string) {
    this.socket = new SocketConnect(token, this.net)

    this.socket.on('message', (data: any, sender?: string) => this.event.emit('message', data, sender))
    this.socket.on('open', () => {
      if (this.reconnectCount === 0) this.event.emit('connect')
      else this.event.emit('reconnected')
    })
    this.socket.on('close-close', () => this.event.emit('disconnect'))
    this.socket.on('pre-reconnect', () => {
      if (!this.socket) this.socket.removeAllListeners()
      this.socket = undefined
      if (this.reconnectLock) return
      this.reconnectLock = true
      this.event.emit('preReconnect')
      setTimeout(() => {
        this.token = undefined
        this.loginLock = false
        if (!this.token) {
          try {
            this.login()
          } catch (e) {
            this.loginLock = false
            this.event.emit('login-error', e)
          }
        }
        this.reconnectLock = false
      }, Math.min(this.reconnectCount++ * 1000, 5000))
    })
  }
}
