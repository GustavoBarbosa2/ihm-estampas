import { Component } from '@angular/core';
import { CarrinhoService } from '../services/carrinho.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  quantidadeCarrinho = 0
  constructor(private carrinhoService: CarrinhoService) {
    this.quantidadeCarrinho = this.carrinhoService.getQuantidadeCarrinho()
    console.log('Quantidade carrinho: ', this.quantidadeCarrinho)
  }

}
