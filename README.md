# PrintPhotos

Aplicação mobile desenvolvida com **Ionic**, **Angular** e **Capacitor** para gestão de uma loja de produtos personalizados.

A aplicação permite aos utilizadores navegar pelos produtos disponíveis, gerir um carrinho de compras, efetuar encomendas e consultar o histórico de compras. Inclui ainda uma área de administração para adicionar novos produtos, categorias e imagens, utilizando o Supabase como backend.

---

## Funcionalidades

### Utilizador

- Criar conta
- Iniciar sessão
- Explorar catálogo de produtos
- Pesquisar produtos
- Visualizar detalhes de cada produto
- Adicionar produtos ao carrinho
- Efetuar compras
- Consultar histórico de encomendas

### Administração

- Adicionar novos produtos
- Adicionar categorias
- Gerir imagens dos produtos
- Definir:
  - Nome
  - Preço
  - Quantidade
  - Categoria
  - Cor
  - Tamanho

### Armazenamento

- Base de dados Supabase
- Upload de imagens
- Armazenamento local através de Ionic Storage
- Persistência utilizando SQLite (em dispositivos móveis)

---

## Tecnologias utilizadas

- Ionic 8
- Angular 17
- Capacitor 6
- TypeScript
- SCSS
- Supabase
- Ionic Storage
- SQLite
- Capacitor Camera

---

## Estrutura do projeto

```
src/
│
├── app/
│   ├── entrar/
│   ├── criar-conta/
│   ├── tabs/
│   ├── loja/
│   ├── produto/
│   ├── carrinho/
│   ├── compra/
│   ├── historico/
│   ├── add-produto/
│   └── services/
│
├── assets/
├── environments/
└── theme/
```

---

## Requisitos

Antes de iniciar o projeto é necessário ter instalado:

- Node.js
- npm
- Ionic CLI
- Angular CLI
- Android Studio (para Android)
- Java JDK
- Git

---

## Instalação

Clonar o repositório

```bash
git clone https://github.com/utilizador/PrintPhotos.git
```

Entrar na pasta

```bash
cd PrintPhotos
```

Instalar dependências

```bash
npm install
```

---


## Variáveis de ambiente

O projeto utiliza o Supabase.

No ficheiro:

```
src/environments/environment.ts
```

deve ser configurado:

```typescript
export const environment = {
  production: false,

  supabaseUrl: "YOUR_SUPABASE_URL",

  supabaseKey: "YOUR_SUPABASE_ANON_KEY"
};
```

---

## Scripts disponíveis

| Comando | Descrição |
|----------|-----------|
| `npm start` | Executa a aplicação |
| `npm run build` | Compila o projeto |
| `npm run watch` | Build em modo desenvolvimento |
| `npm test` | Executa os testes |
| `npm run lint` | Analisa o código com ESLint |

---

## Dependências principais

- @ionic/angular
- @capacitor/core
- @capacitor/android
- @capacitor/camera
- @ionic/storage
- @supabase/supabase-js
- rxjs

---

## Arquitetura

A aplicação segue uma arquitetura baseada em componentes Angular.

- Pages para as diferentes funcionalidades
- Services para comunicação com o Supabase
- Routing modular
- Persistência local com Ionic Storage
- Upload de imagens através do Capacitor Camera

---

## Funcionalidades implementadas

- Autenticação de utilizadores
- Catálogo de produtos
- Gestão de categorias
- Gestão de cores
- Upload de imagens
- Carrinho de compras
- Histórico de compras
- Validação de formulários
- Armazenamento local
- Integração com Supabase

---

## Melhorias futuras

- Sistema de favoritos
- Gestão de stock em tempo real
- Notificações push
- Pagamentos online
- Dashboard administrativa
- Perfil de utilizador
- Avaliações de produtos
- Gestão de promoções

---


```
PrintPhotos
Ionic + Angular + Capacitor + Supabase
```
