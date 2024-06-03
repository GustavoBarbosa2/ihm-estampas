import { Injectable } from '@angular/core';
import { compras as Compras } from './compras';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  private compras: Compras[] = [];
  constructor(private storage: Storage) {
    this.compras = [];
    this.init();
  }

  async init() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    const storage = await this.storage.create();
    const compra = await storage.get('compras');
    if (compra) {
      this.compras = compra;
    }
  }

  async getCompras(): Promise<Compras[]> {
    return this.compras;
  }

  async inserirCompras(compra: Compras) {
    if (!this.compras.includes(compra)) {
      this.compras.push(compra);
      await this.storage.set('compras', this.compras);
    }
  }

  getQuantidadeCompras() {
    return this.compras.length;
  }

  async limparCompras(){
    this.compras = []
    await this.storage.set('compras', this.compras)
  }
}
