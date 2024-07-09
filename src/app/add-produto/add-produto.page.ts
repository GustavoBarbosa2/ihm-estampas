import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';
import { produtos as Produto } from '../services/produtos';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-add-produto',
  templateUrl: './add-produto.page.html',
  styleUrls: ['./add-produto.page.scss'],
})
export class AddProdutoPage implements OnInit {
  credenciais!: FormGroup;
  corSelecionada: string = '';
  cores: any[] = [];
  categoriaSelecionada: string = '';
  categorias: any[] = [];
  imagem?: string = '';
  imagemClass: string | undefined;
  mostrarFormularioNovaCategoria = false;
  novaCat: string = '';

  constructor(
    private supabase: SupabaseService,
    private route: Router,
    private fb: FormBuilder,
    private alertController: AlertController,
    private popController: PopoverController,
    private loadingCtrl: LoadingController
  ) {
    this.credenciais = this.fb.group({
      nome: ['', Validators.required],
      preco: [null, [Validators.required, Validators.min(0)]],
      quantidade: [null, [Validators.required, Validators.min(0)]],
      tamanho: ['Não Selecionado', Validators.required],
      cor: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.carregarCores();
    await this.carregarCategorias();
  }

  async adicionarProdutoLista() {
    const alert = await this.alertController.create({
      header: 'Deseja adicionar o produto',
      message: 'Tem certeza que deseja adicionar este produto à lista de produtos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Adicionar',
          handler: async () => {
            const produto: Produto = {
              nome: this.credenciais.get('nome')?.value,
              imagemCarregada: this.imagem,
              preco: this.credenciais.get('preco')?.value,
              quantidade: this.credenciais.get('quantidade')?.value,
              tamanho: this.credenciais.get('tamanho')?.value,
              cor: this.credenciais.get('cor')?.value,
              categoria: this.credenciais.get('categoria')?.value,
              imagem: ''
            };
            await this.supabase.adicionarProduto(produto);
            this.supabase.mostrarMensagem('Produto adicionado à lista!');
            this.route.navigateByUrl('/tabs/loja');
          }
        }
      ]
    });
    await alert.present();
  }

  async cancelar() {
    const alert = await this.alertController.create({
      header: 'Deseja cancelar a adição do produto',
      message: 'Tem certeza que deseja cancelar a adição deste produto à lista de produtos?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.supabase.mostrarMensagem('Cancelamento efetuado com sucesso!');
            this.route.navigateByUrl('/tabs/loja');
          }
        }
      ]
    });
    await alert.present();
  }

  async escolherImagem() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    this.imagem = image.webPath;
  }

  async confirmar() {
    const data = await this.popController.dismiss({
      imagem: this.imagem,
    });
    if (data) {
      this.imagemClass = this.imagem;
    }
  }

  validarNumero(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  async carregarCores() {
    this.cores = await this.supabase.getCores();
  }

  async carregarCategorias() {
    this.categorias = await this.supabase.getCategorias();
  }

  toggleNovaCategoriaForm() {
    this.mostrarFormularioNovaCategoria = !this.mostrarFormularioNovaCategoria;
  }

  definirCategoria(event: any) {
    this.novaCat = event.data;
  }

  async acrescentarCategoria() {
    console.log('Nome da nova categoria:', this.novaCat);

    if (this.novaCat.length === 0) {
      console.error('Nome da categoria não pode ser vazio.');
      return;
    }
    const { data, error } = await this.supabase.adicionarCategoria({ nome: this.novaCat });

    if (error) {
      console.error('Erro ao adicionar categoria:', error);
      return;
    }

    this.mostrarFormularioNovaCategoria = false;
    this.novaCat = '';
    await this.carregarCategorias(); // Refresh categories list
  }

  cancelarAcrescentarCategoria() {
    this.mostrarFormularioNovaCategoria = false;
    this.novaCat = '';
  }
}
