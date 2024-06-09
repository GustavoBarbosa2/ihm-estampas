import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { utilizador as Utilizador } from './utilizador';
import { produtos as Produtos } from './produtos';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})

export class SupabaseService {
  private supabaseUrl = 'https://hnsffgsqdsirdurgerbv.supabase.co'
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhuc2ZmZ3NxZHNpcmR1cmdlcmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxNTA4MzIsImV4cCI6MjAzMjcyNjgzMn0.jhpjDUhFuSFstxIi94LXGH71wxw8FDBuWiSOSsOaGWI'
  supabaseClient: SupabaseClient;
  
  constructor(
    private route: Router,
    private alerta_: AlertController, 
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { 
    this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);
  }

  get user(){
    return this.supabaseClient.auth.getUser().then(({data}) => data.user)
  }
  

  get utilizador() {
    return this.user
      .then((user) => user?.email)
      .then((email) =>
        this.supabaseClient
        .from("utilizadores")
        .select(`nome, email, uuid, created_at, updated_at, palavra_passe`)
        .eq("email", email)
        .single(),
      );
  }
  
  async addImage(image: any){
    const file = await this.convertImageToBlob(image);
  const fileName = `perfil-picture-${new Date().getTime()}.jpg`;
  const fileType = 'image/jpeg';

  // Upload para o Supabase
  const { data, error } = await this.supabaseClient.storage
    .from('perfil-fotos')
    .upload(fileName, file, {
      contentType: fileType,
      upsert: true,
    });

  if (error) {
    console.error(error);
  } else {
    console.log(`Arquivo uploaded com sucesso!`);
    this.supabaseClient.auth.updateUser({
      data: {
        picture: data.path,
      },
    });
  }
  }

  async convertImageToBlob(image: any) {
    const response = await fetch(image.webPath);
    const blob = await response.blob();
    return blob;
  }

  async entrar(credencias: {email: any, password: any}){
    const {error, data} = await this.supabaseClient.auth.signInWithPassword({
      email: credencias.email,
      password: credencias.password
    })
    if (error){
      throw error
    }
    return data
  }

  async registar(credencias: {email: any, password: any}): Promise< {user: {id: string}}>{
    const {error, data} = await this.supabaseClient.auth.signUp(credencias)
    if(error){
      throw error
    }
    return data as {user: {id: string}}
  }

  async sair(){
    await this.supabaseClient.auth.signOut()
    this.route.navigateByUrl('/')
  }

  async mostrarErro(titulo: any, mensagem: any){
    const alerta =  await this.alerta_.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alerta.present()
  }

  async mostrarMensagem(mensagem: string) {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 1500,
      position: 'bottom' 
    });
    toast.present();
  }

  async inserirUtlizador(utilizador: Utilizador){
    const {error, data} = await this.supabaseClient.from('utilizadores').insert({
      nome: utilizador.nome,
      email: utilizador.email,
      palavra_passe: utilizador.password,
      uuid: utilizador.uuid
    }).single()

    if(error){
      return null
    }
    return data
  }

  async getProdutosFiltrados(filterString?: string): Promise<Produtos[]>{
    let query = `SELECT * FROM produtos`

    if(filterString){
      query += ` WHERE ${filterString}`
    }

    const {data, error} = await this.supabaseClient
    .from('produtos')
    .select(query)

    if(error){
      throw error
    }
    return data as unknown as Produtos[]
  }

  async getProdutos(){
    const {data, error} = await this.supabaseClient.from('produtos').select('*')
    if(error){
      throw error
    }
    return data
  }

  async getProdutoById(id: number){
    const {error, data} = await this.supabaseClient.from('produtos').select('*').eq('id', id).single()

    if(error){
      throw error
    }
    return data
  }

  async loadingMensagem(mensagem: any){
    const loading = await this.loadingCtrl.create({
      message: mensagem
    })
    loading.present()
  }
}

