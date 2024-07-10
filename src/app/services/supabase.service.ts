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
  // URL e chave do Supabase para conexão com o banco de dados
  private supabaseUrl = 'https://hnsffgsqdsirdurgerbv.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhuc2ZmZ3NxZHNpcmR1cmdlcmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxNTA4MzIsImV4cCI6MjAzMjcyNjgzMn0.jhpjDUhFuSFstxIi94LXGH71wxw8FDBuWiSOSsOaGWI';
  supabaseClient: SupabaseClient;

  constructor(
    private route: Router,
    private alerta_: AlertController, 
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { 
    this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);
  }

  // Retorna o utilizador autenticado
  get user() {
    return this.supabaseClient.auth.getUser().then(({data}) => data.user);
  }

  // Retorna os detalhes do utilizador autenticado
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

  // Adiciona uma imagem ao armazenamento Supabase
  async addImage(image: any) {
    const file = await this.convertImageToBlob(image);
    const fileName = `perfil-picture-${new Date().getTime()}.jpg`;
    const fileType = 'image/jpeg';

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

  // Converte uma imagem para blob
  async convertImageToBlob(image: any) {
    const response = await fetch(image.webPath);
    const blob = await response.blob();
    return blob;
  }

  // Realiza o login do utilizador
  async entrar(credencias: { email: any, password: any }) {
    const { error, data } = await this.supabaseClient.auth.signInWithPassword({
      email: credencias.email,
      password: credencias.password
    });
    if (error) {
      throw error;
    }
    return data;
  }

  // Regista um novo utilizador
  async registar(credencias: { email: any, password: any }): Promise<{ user: { id: string } }> {
    const { error, data } = await this.supabaseClient.auth.signUp(credencias);
    if (error) {
      throw error;
    }
    return data as { user: { id: string } };
  }

  // Obtém todas as cores a base de dados
  async getCores() {
    const { data, error } = await this.supabaseClient
      .from('cor')
      .select('*');

    if (error) {
      console.error('Erro ao buscar cores:', error);
      return [];
    }

    return data;
  }

  // Obtém todas as categorias a base de dados
  async getCategorias() {
    const { data, error } = await this.supabaseClient
      .from('categoria')
      .select('*');

    if (error) {
      console.error('Erro ao buscar categoria:', error);
      return [];
    }

    return data;
  }

  // Adiciona uma nova categoria a base de dados
  async adicionarCategoria(categoria: { nome: string }) {
    const { data, error } = await this.supabaseClient
      .from('categoria')
      .insert([{ nome: categoria.nome }]);

    if (error) {
      console.error('Erro ao adicionar categoria SUPABASE:', error);
    }

    return { data, error };
  }

  // Realiza o logout do utilizador
  async sair() {
    await this.supabaseClient.auth.signOut();
    this.route.navigateByUrl('/');
  }

  // Mostra uma mensagem de erro
  async mostrarErro(titulo: any, mensagem: any) {
    const alerta = await this.alerta_.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alerta.present();
  }

  // Mostra uma mensagem toast
  async mostrarMensagem(mensagem: string) {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  // Insere um novo utilizador na base de dados
  async inserirUtlizador(utilizador: Utilizador) {
    const { error, data } = await this.supabaseClient.from('utilizadores').insert({
      nome: utilizador.nome,
      email: utilizador.email,
      palavra_passe: utilizador.password,
      uuid: utilizador.uuid
    }).single();

    if (error) {
      return null;
    }
    return data;
  }

  // Obtém produtos filtrados com base em uma string de filtro
  async getProdutosFiltrados(filterString?: string): Promise<Produtos[]> {
    let query = `SELECT * FROM produtos`;

    if (filterString) {
      query += ` WHERE ${filterString}`;
    }

    const { data, error } = await this.supabaseClient
      .from('produtos')
      .select(query);

    if (error) {
      throw error;
    }
    return data as unknown as Produtos[];
  }

  // Obtém todos os produtos
  async getProdutos() {
    const { data, error } = await this.supabaseClient.from('produtos').select('*');
    if (error) {
      throw error;
    }
    return data;
  }

  // Obtém um produto pelo ID
  async getProdutoById(id: number) {
    const { error, data } = await this.supabaseClient.from('produtos').select('*').eq('id', id).single();

    if (error) {
      throw error;
    }
    return data;
  }

  // Mostra uma mensagem de carregamento
  async loadingMensagem(mensagem: any) {
    const loading = await this.loadingCtrl.create({
      message: mensagem
    });
    loading.present();
  }

  // Adiciona um novo produto a base de dados
  async adicionarProduto(produtos: Produtos) {
    try {
      console.log("SUPABASE");
      const { data, error } = await this.supabaseClient
        .from('produtos')
        .insert([{
          nome: produtos.nome,
          imagem: produtos.imagemCarregada,
          preco: produtos.preco,
          quantidade: produtos.quantidade,
          tamanho: produtos.tamanho,
          cor: produtos.cor,
          categoria: produtos.categoria,
        }])
        .single();

      this.route.navigateByUrl('/tabs/loja');

      if (error) {
        console.error('Erro ao adicionar produto:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro inesperado ao adicionar produto:', error);
      return null;
    }
  }

  // Faz o upload de uma imagem para o armazenamento Supabase
  async uploadImage(image: any): Promise<string | null> {
    const response = await fetch(image.webPath);
    const blob = await response.blob();
    const filePath = `${new Date().getTime()}.${blob.type.split('/')[1]}`;
    
    const { data, error } = await this.supabaseClient
      .storage
      .from('perfil-fotos')
      .upload(filePath, blob);

    if (error) {
      console.error('Erro ao carregar imagem:', error.message);
      return null;
    }

    const { publicUrl } = this.supabaseClient
      .storage
      .from('perfil-fotos')
      .getPublicUrl(filePath)
      .data;

    return publicUrl;
  }

  // Elimina um produto da base de dados
  async eliminarProduto(produtoId: string): Promise<void> {
    const { data, error } = await this.supabaseClient
      .from('produtos')
      .delete()
      .match({ id: produtoId });

    if (error) {
      throw error;
    }

    this.route.navigateByUrl('/tabs/loja');
  }
}
