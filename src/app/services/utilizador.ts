export interface utilizador{
  id?: number;
  nome: string;
  email: string;
  password: string;
  uuid: string;
  created_at?:Date;
  updated_at?:Date;
}