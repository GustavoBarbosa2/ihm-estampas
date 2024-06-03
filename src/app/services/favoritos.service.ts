import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { produtos as Produtos} from './produtos';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private favoritos: Produtos[]
  constructor(private storage: Storage) { 
    this.favoritos = []
    this.init()
  }

  async init(){
    await this.storage.defineDriver(CordovaSQLiteDriver)
    const storage = await this.storage.create()
    const favoritos = await storage.get('favoritos')
    if(favoritos){
      this.favoritos = favoritos
    }
  }

  async getFavoritos(): Promise<Produtos[]>{
    return this.favoritos
  }

  async inserirFavorito(favorito: Produtos){
    if (!this.favoritos.includes(favorito)) {
      this.favoritos.push(favorito);
      await this.storage.set('favoritos', this.favoritos);
    }
  }

  async eliminarFavorito(id: number){
    const index = this.favoritos.findIndex(fav => fav.id === id)
    if(index > 0){
      this.favoritos.splice(index, 1)
      await this.storage.set('favoritos', this.favoritos)
    }
  }
}
