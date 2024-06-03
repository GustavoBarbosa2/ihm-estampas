import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { produtos as Produtos } from '../services/produtos';
import { FavoritosService } from '../services/favoritos.service';
import { CarrinhoService } from '../services/carrinho.service';
import { AlertController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.page.html',
  styleUrls: ['./produto.page.scss'],
})
export class ProdutoPage implements OnInit {
  produto!: Produtos  
  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private favoritos: FavoritosService,
    private carrinho: CarrinhoService,
    private alertController: AlertController,
    private popController: PopoverController
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')
    this.produto = await this.supabase.getProdutoById(Number(id))
  }

  async adicionarLista(){
    await this.favoritos.inserirFavorito(this.produto)
    this.supabase.mostrarMensagem('Produto adicionado com sucesso')
  }

  async adicionarCarrinho(){
    const alert = await this.alertController.create({
      header: 'Deseja adicionar o produto ao carrinho',
      message: 'Tem certeza que deseja adicionar este produto ao carrinho?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Adicionar',
          handler: () => {
            this.carrinho.inserirCarrinho(this.produto);
          }
        }
      ]
    });
    await alert.present();
  }
}
