import { Injectable } from '@angular/core';
import { produtos } from './produtos';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private total: number = 0
  private carrinho: produtos[]
  private extras: number = 0
  constructor(private storage: Storage) { 
    this.carrinho = []
    this.init()
  }

  async init(){
    await this.storage.defineDriver(CordovaSQLiteDriver)
    const storage = await this.storage.create()
    const carrinho = await storage.get('carrinho')
    if(carrinho){
      this.carrinho = carrinho
    }
  }

  async getCarrinho(): Promise<produtos[]>{
    return this.carrinho
  }

  async inserirCarrinho(carinho: produtos){
    if (!this.carrinho.includes(carinho)) {
      carinho.id = Date.now()
      this.carrinho.push(carinho);
      await this.storage.set('carrinho', this.carrinho);
    }
  }

  async eliminarCarrinho(id: number){
    const index = this.carrinho.findIndex(car => car.id === id)
    if(index >= 0){
      this.carrinho.splice(index, 1)
      await this.storage.set('carrinho', this.carrinho)
    }
  }

  getQuantidadeCarrinho() {
    return this.carrinho.length
  }

  async getExtras(){
    this.extras = 0
    for(let i = 0; i < this.carrinho.length; i++){
      if(this.carrinho[i].imagemCarregada){
        this.extras += 3.5
      }
    }
    return this.extras
  }

  async getTotal(){
    this.total = 0
    for (let i = 0; i < this.carrinho.length; i++) {
      this.total += this.carrinho[i].preco
    }
    return this.total
  }

  async limparCarrinho(){
    this.carrinho = []
    await this.storage.set('carrinho', this.carrinho)
  }
}
