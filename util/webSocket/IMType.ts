export interface NetConfig extends URL {
  ssl?: boolean
}

export enum SocketState {
  'close' = 0,
  'open'
}
