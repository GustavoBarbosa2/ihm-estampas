import { produtos } from "./produtos"

export interface compras{
  id?: number
  preco: number
  envio: string
  morada: string
  pagamento: string
  feedback?: string
  produto: produtos[]
  numeroMBWAY?: number
  created_at?:Date
}