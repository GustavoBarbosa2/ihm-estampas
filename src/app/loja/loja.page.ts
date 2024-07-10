import { Component, OnInit, ViewChild } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { produtos as Produtos, produtos} from '../services/produtos';
import { Router } from '@angular/router';
import { IonPopover, ViewDidEnter } from '@ionic/angular';
import { CallTracker } from 'assert';

@Component({
  selector: 'app-loja',
  templateUrl: './loja.page.html',
  styleUrls: ['./loja.page.scss'],
})
export class LojaPage implements OnInit, ViewDidEnter {
  @ViewChild('filterPopover') filterPopover!: IonPopover;
  
  tamanhoSelecionado: string = '';
  corSelecionada: string = '';
  cores: any[] = [];
  categoriaSelecionada: string = '';
  categorias: any[] = [];
  produtos: Produtos[] = []
  produtosCopy: Produtos[] = []
  pesquisa: string = ''

  constructor(
    private supabase: SupabaseService,
    private route: Router
  ) { }

  ngOnInit() {
    this.carregarProdutos();
    this.carregarCores();
    this.carregarCategorias();
  }

  async carregarCores() {
    this.cores = await this.supabase.getCores();
  }

  async carregarCategorias() {
    this.categorias = await this.supabase.getCategorias();
  }
  
  async ionViewDidEnter(){
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
             (this.corSelecionada ? produto.cor === this.corSelecionada : true) &&
             (this.categoriaSelecionada ? produto.categoria === this.categoriaSelecionada : true)
    })
  }

  irDetalhes(id?: number){
    this.route.navigate(['/produto', id])
  }

  limparFiltros() {
    this.pesquisa = '';
    this.tamanhoSelecionado = '';
    this.corSelecionada = '';
    this.categoriaSelecionada = '';
    this.pesquisarProduto();
  }

  fecharPop(){
    this.filterPopover.dismiss()
  }

  async adicionarProdutos(){
    this.route.navigateByUrl('/add-produto')
  }
}
