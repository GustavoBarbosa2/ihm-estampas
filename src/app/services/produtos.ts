export interface produtos{
  id?: number
  nome: string
  preco: number
  imagem: string
  posicao?: string
  imagemClass?: string
  imagemCarregada?: string
  quantidade: number
  cor: string
  tamanho: string
  created_at?:Date
}