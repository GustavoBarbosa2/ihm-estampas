import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';
import { utilizador as Utilizador } from '../services/utilizador';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.page.html',
  styleUrls: ['./criar-conta.page.scss'],
})
export class CriarContaPage implements OnInit {
  credenciais!: FormGroup
  utilizador!: Utilizador
  constructor(
    private route: Router,
    private supabase: SupabaseService,
    private fb: FormBuilder,
    private loadCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.credenciais = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      nome: ['', Validators.required]
    })
  }


  async entrarConta(){
    await this.route.navigateByUrl('/')
  }

  async criarConta(){   
    const loading = await this.loadCtrl.create()
    await loading.present()

    try{
      const {user} = await this.supabase.registar({
        email: this.credenciais.get('email')?.value,
        password: this.credenciais.get('password')?.value
      })

      if(user){
        this.utilizador ={
          nome: this.credenciais.get('nome')?.value,
          email: this.credenciais.get('email')?.value,
          password: this.credenciais.get('password')?.value,
          uuid: user.id
        }
      }

      await this.supabase.inserirUtlizador(this.utilizador)

      await loading.dismiss()
      this.route.navigateByUrl('/tabs/loja')
      this.supabase.mostrarMensagem('Conta criada com sucesso!')
      
    }catch (error: any){
      await loading.dismiss()
      this.supabase.mostrarErro('Erro ao criar a conta', error.message)
    }
  }
}
