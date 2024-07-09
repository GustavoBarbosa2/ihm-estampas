export interface produtos{
  id?: number
  nome: string
  preco: number
  imagem: string
  posicao?: string
  imagemClass?: string
  imagemCarregada?: string
  quantidade: number
  isFavorito?: boolean
  cor: string
  tamanho: string
  categoria: string
  created_at?:Date
}