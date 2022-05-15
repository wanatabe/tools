import { EventEmitter } from 'eventemitter3'
import { NetConfig, SocketState } from './IMType'

export default class SocketConnect extends EventEmitter {
  private token?: string
  private net?: NetConfig
  private state?: number
  private socket: WebSocket

  constructor(token, net) {
    super()
    this.token = token
    this.net = net
    this.state = SocketState.close

    const host = net.href.replace(/^http/, 'ws')
    this.socket = new WebSocket(`${host}/listener?token=${token}`)
    this.socket.onclose = this.onclose.bind(this, false)
    this.socket.onerror = this.onclose.bind(this, true)
    this.socket.onopen = this.onopen.bind(this)
    this.socket.onmessage = this.onmessage.bind(this)
  }

  onclose(isError, e) {
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
  onmessage(e) {
    const { sender, data } = JSON.parse(e.data)
    this.emit('message', data, sender)
  }
}
