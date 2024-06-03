import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.page.html',
  styleUrls: ['./conta.page.scss'],
})
export class ContaPage implements OnInit {
  utilizador: any
  file?: File
  constructor(
    private supabase: SupabaseService,
    private route: Router,
    private alertaCrontoller: AlertController
  ) { 
  }

  ngOnInit() {
    this.supabase.utilizador.then(user => {
      this.utilizador = user;
      console.log('Utilizador autenticado:', this.utilizador);
    }).catch(error => {
      console.error('Error fetching user:', error);
    });
  }
  // TODO
  // async selectImage(){
  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: true,
  //     source: CameraSource.Photos,
  //     resultType: CameraResultType.Uri
  //   })
  //   this.supabase.addImage(image)
  // }

  irHistorico(){
    this.route.navigateByUrl('/historico') 
  }

  async sair(){
    const alerta = await this.alertaCrontoller.create({
      header: 'Confirmar saída',
      message: 'Tem certeza que deseja sair da conta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          },
        },
        {
          text: 'Sair',
          handler: () => {
            this.supabase.sair()
          },
        },
      ],
    })
    await alerta.present()
  }
}
