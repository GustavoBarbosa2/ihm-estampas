import { Component, OnInit } from '@angular/core';
import { produtos } from '../services/produtos';
import { FavoritosService } from '../services/favoritos.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  public favoritos: any[] = []
  constructor(
    private favoritosS: FavoritosService,
    private alertController: AlertController,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.favoritosS.init()
    this.favoritosS.getFavoritos().then(fav => {
      this.favoritos = fav;
    });
  }

  irDetalhes(id?: number){
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
            this.favoritosS.eliminarFavorito(id);
          }
        }
      ]
    });
    await alert.present();
  }
}
