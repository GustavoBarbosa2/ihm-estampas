import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.page.html',
  styleUrls: ['./entrar.page.scss'],
})
export class EntrarPage implements OnInit {
  credencias!: FormGroup;
  constructor(
    private supabase: SupabaseService, 
    private route: Router,
    private fb: FormBuilder,
    private loadCtrl: LoadingController
  ) {
   }

  ngOnInit() {
    this.credencias = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    })
  }

  async entrar(){
    const loading = await this.loadCtrl.create()
    await loading.present()

    this.supabase.entrar(this.credencias.value).then(async data => {
      await loading.dismiss()
      this.route.navigateByUrl('/tabs/loja', {replaceUrl: true})
    }, async error => {
      await loading.dismiss()
      this.supabase.mostrarErro('Erro ao entrar na conta', error.message)
    })
  }
  async criarConta(){
    this.route.navigateByUrl('/criar-conta')
  }
}
