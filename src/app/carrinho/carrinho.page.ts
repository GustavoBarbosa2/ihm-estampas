import { Component, OnInit } from '@angular/core';
import { CarrinhoService } from '../services/carrinho.service';
import { Router } from '@angular/router';
import { AlertController, ViewDidEnter } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})
export class CarrinhoPage implements OnInit, ViewDidEnter {
  public carrinhos: any[] = []
  public total: number = 0
  public extras: number = 0 


  constructor(
    private carrinhoS: CarrinhoService,
    private router: Router,
    private alertController: AlertController,
    private supabase: SupabaseService
  ) {
  }

  async ngOnInit() {
    await this.carrinhoS.init() 
  }

  async ionViewDidEnter() {
    await this.carrinhoS.getCarrinho().then(car => {
      this.carrinhos = car;
      this.getExtras()
      this.getTotal();
    });
  }

  irDetalhes(id: number){
    this.router.navigate(['/produto', id])
  }

  async eliminarFavorito(id: number){
    const alert = await this.alertController.create({
      header: 'Confirmar eliminação',
      message: 'Tem certeza que deseja eliminar este produto do carrinho?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.carrinhoS.eliminarCarrinho(id);
            this.router.navigateByUrl('/carrinho')
            this.getExtras()
            this.getTotal()
          }
        }
      ]
    });
    await alert.present();
  }

  getExtras(){
    this.carrinhoS.getExtras().then(extras => {
      this.extras = extras;
    });
  }

  getTotal(){
    this.carrinhoS.getTotal().then(total => {
      this.total = total + this.extras;
    });
  }

  async finalizarCompra(){
    if(this.carrinhos.length === 0){
      this.supabase.mostrarErro('Carrinho vazio', 'Adicione alguns itens ao carrinho para finalizar')
    }else{
      const alert = await this.alertController.create({
        header: 'Confirmar finalização da compra',
        message: 'Tem certeza que deseja finalizar esta compra?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancelar');
            }
          },
          {
            text: 'Comprar',
            handler: () => {
                this.router.navigateByUrl('/compra')
            }
          }
        ]
      });
      await alert.present();
    }
  }
  
}
