import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { produtos as Produtos } from '../services/produtos';
import { FavoritosService } from '../services/favoritos.service';
import { CarrinhoService } from '../services/carrinho.service';
import { AlertController, PopoverController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.page.html',
  styleUrls: ['./produto.page.scss'],
})
export class ProdutoPage implements OnInit {
  produto!: Produtos  
  imagem?: string = ''
  posicao: string = ''
  imagemClass?: string
  isFavorito: boolean = false
  id: any;

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
    this.imagemClass = this.produto.imagemClass
  }

  async adicionarLista(){
    const alert = await this.alertController.create({
      header: 'Deseja adicionar o produto aos favoritos',
      message: 'Tem certeza que deseja adicionar este produto aos favoritos?',
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
            this.favoritos.inserirFavorito(this.produto);
            this.supabase.mostrarMensagem('Produto adicionado aos favoritos!')
          }
        }
      ]
    });
    await alert.present();
  }

  toggleFavorito() {
    if (this.isFavorito) {
      this.favoritos.eliminarFavorito(this.produto.id);
      this.isFavorito = false;
      this.produto.isFavorito = this.isFavorito
      this.supabase.mostrarMensagem('Produto removido dos favoritos!');
    } else {
      this.favoritos.inserirFavorito(this.produto);
      this.isFavorito = true;
      this.produto.isFavorito = this.isFavorito
      this.supabase.mostrarMensagem('Produto adicionado aos favoritos!');
    }
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
            this.supabase.mostrarMensagem('Produto adicionado ao carrinho!')
          }
        }
      ]
    });
    await alert.present();
  }

  async escolherImagem(){
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    this.imagem = image.webPath;
  }

  async confirmar(){
    if(this.posicao === ''){
      this.supabase.mostrarErro('Erro ao personalizar o artigo', 'Porfavor selecione uma posição')
    }else{
      const data = await this.popController.dismiss({
        imagem: this.imagem,
        posicao: this.posicao
      });
      if(data){
        this.produto.imagemCarregada = this.imagem
        this.produto.posicao = this.posicao
        this.produto.imagemClass = this.imagemClass
      }
    }
  }
  alterarClasseImagem() {
    if (this.posicao === 'esquerda') {
      this.imagemClass = 'imagem-esquerda';
    } else if (this.posicao === 'centro') {
      this.imagemClass = 'imagem-centro';
    } else if (this.posicao === 'direita') {
      this.imagemClass = 'imagem-direita';
    }
  }

  async eliminarProduto(produtoId: any) {
    console.log('ID do produto a ser eliminado:', produtoId);
    if (!produtoId) {
      console.error('ID do produto está undefined');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Tem certeza que deseja eliminar este produto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.supabase.eliminarProduto(produtoId);
            } catch (error) {
              console.error('Erro ao eliminar produto', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

}
