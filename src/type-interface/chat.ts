export interface IMessage {
  id: string,
  type: 'user' | 'ai'
  text: string,
  products: any[],
  timestamp: number
}