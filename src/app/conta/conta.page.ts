import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

@Component({
  selector: 'app-conta',
  templateUrl: './conta.page.html',
  styleUrls: ['./conta.page.scss'],
})
export class ContaPage implements OnInit {
  utilizador: any
  file?: File
  constructor(private supabase: SupabaseService) { 
  }

  ngOnInit() {
    this.supabase.utilizador.then(user => {
      this.utilizador = user;
      console.log('Utilizador autenticado:', this.utilizador);
    }).catch(error => {
      console.error('Error fetching user:', error);
    });
  }

  async selectImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri
    })
    this.supabase.addImage(image)
  }

}
