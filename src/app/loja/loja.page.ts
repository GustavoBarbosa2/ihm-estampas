import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { produtos as Produtos, produtos} from '../services/produtos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loja',
  templateUrl: './loja.page.html',
  styleUrls: ['./loja.page.scss'],
})
export class LojaPage implements OnInit {
  tamanhoSelecionado!: string;
  corSelecionada!: string;
  produtos: Produtos[] = []
  produtosCopy: Produtos[] = []
  pesquisa: string = ''

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarProdutos()
  }

  async carregarProdutos(){
    try{
      this.produtos = await this.supabase.getProdutos()
      this.produtosCopy = [...this.produtos]
      console.log('produtos: ', this.produtos)
    }catch(error: any){
      console.error('Erro ao carregar produtos', error)
    }
  }

  pesquisarProduto(){
    this.produtos = this.produtosCopy.filter(produto => {
      return produto.nome.toLowerCase().includes(this.pesquisa.toLowerCase()) &&
             (this.tamanhoSelecionado ? produto.tamanho === this.tamanhoSelecionado : true) &&
             (this.corSelecionada ? produto.cor === this.corSelecionada : true)
    })
  }

  irDetalhes(id?: number){
    this.router.navigate(['/produto', id])
  }

  limparFiltros() {
    this.pesquisa = '';
    this.tamanhoSelecionado = '';
    this.corSelecionada = '';
    this.pesquisarProduto();
  }
}
