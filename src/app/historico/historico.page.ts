import { Component, OnInit } from '@angular/core';
import { compras as Compras} from '../services/compras';
import { ComprasService } from '../services/compras.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {
   compras: Compras[] = []
  constructor(
    private comprasS: ComprasService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.comprasS.init()
  }

  async ionViewDidEnter() {
    await this.comprasS.getCompras().then(comp => {
      this.compras = comp;
    });
  }

  async limpar(){
    const alerta = this.alertController.create({
      header: 'Confirmar limpeza',
      message: 'Tem certeza que deseja limpar o historico de compras?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          },
        },
        {
          text: 'Limpar',
          handler: () => {
            this.comprasS.limparCompras()
          },
        },
      ],
    });
    (await alerta).present();
    (await alerta).onDidDismiss().then(() => {
      this.ionViewDidEnter();
    })
  }
}
