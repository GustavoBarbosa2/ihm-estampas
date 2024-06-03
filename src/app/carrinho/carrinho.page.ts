import { Component, OnInit } from '@angular/core';
import { CarrinhoService } from '../services/carrinho.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})
export class CarrinhoPage implements OnInit {
  public carrinhos: any[] = []
  public total: number = 0

  constructor(
    private carrinhoS: CarrinhoService,
    private router: Router,
    private alertController: AlertController
  ) {
  }

  async ngOnInit() {
    await this.carrinhoS.init() 
  }

  async ionViewDidEnter() {
    await this.carrinhoS.getCarrinho().then(car => {
      this.carrinhos = car;
      this.getTotal();
    });
  }

  irDetalhes(id: number){
    this.router.navigate(['/produto', id])
  }

  async eliminarFavorito(id: number){
    const alert = await this.alertController.create({
      header: 'Confirmar eliminação',
      message: 'Tem certeza que deseja eliminar este produto dos favoritos?',
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
          }
        }
      ]
    });
    await alert.present();
  }

  getTotal(){
    this.carrinhoS.getTotal().then(total => {
      this.total = total;
    });
  }
}
