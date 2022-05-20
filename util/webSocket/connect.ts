import { EventEmitter } from 'eventemitter3'
import { NetConfig, SocketState } from './IMType'

export default class SocketConnect extends EventEmitter {
  private token?: String
  private net?: NetConfig
  private state?: Number
  private socket: WebSocket

  constructor(token: string, net: NetConfig) {
    super()
    this.token = token
    this.net = net
    this.state = SocketState.close

    const protocol = net.ssl ? 'wss://' : 'ws://'
    const { host } = net
    this.socket = new WebSocket(`${protocol}${host + '1'}/listener?token=${token}`)
    this.socket.onclose = this.onclose.bind(this, false)
    this.socket.onerror = this.onclose.bind(this, true)
    this.socket.onopen = this.onopen.bind(this)
    this.socket.onmessage = this.onmessage.bind(this)
  }

  onclose(isError: boolean, e: any) {
    this.state = SocketState.close
    if (isError) {
      this.emit('close-close')
      this.emit('error', e)
    } else {
      this.emit('close-close')
      this.emit('close', e)
    }
    this.socket.onclose = this.socket.onerror = this.socket.onopen = this.socket.onmessage = null
    this.socket.close()
    this.emit('pre-reconnect')
  }
  onopen() {
    if (this.state === SocketState.open) return
    this.state = SocketState.open
    this.emit('open')
  }
  onmessage(e: any) {
    const { sender, data } = JSON.parse(e.data)
    this.emit('message', data, sender)
  }
}
