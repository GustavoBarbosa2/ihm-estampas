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
  // Definição dos atributos da classe
  credenciais!: FormGroup;
  corSelecionada: string = '';
  cores: any[] = [];
  categoriaSelecionada: string = '';
  categorias: any[] = [];
  imagem?: string = '';
  imagemClass: string | undefined;
  mostrarFormularioNovaCategoria = false;
  novaCat: string = '';
  tamanho: string = '';
  nome: any;
  preco: any;
  quantidade: any;
  categoria: any;
  cor: any;
  popoverImagem: any;
  precoInvalido: boolean = false;
  quantidadeInvalida: boolean = false;

  // Construtor para injetar dependências e inicializar o formulário
  constructor(
    private supabase: SupabaseService,
    private route: Router,
    private fb: FormBuilder,
    private alertController: AlertController,
    private popController: PopoverController,
    private loadingCtrl: LoadingController
  ) {
    // Inicializa o formulário com validações
    this.credenciais = this.fb.group({
      nome: ['', Validators.required],
      preco: [null, [Validators.required, Validators.min(0)]],
      quantidade: [null, [Validators.required, Validators.min(0)]],
      tamanho: ['Não Selecionado', Validators.required],
      cor: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }

  // Método que é chamado ao inicializar o componente
  async ngOnInit() {
    await this.carregarCores();
    await this.carregarCategorias();
  }

  // Método para adicionar um produto à lista
  async adicionarProdutoLista() {
    if (this.precoInvalido || this.quantidadeInvalida || !this.nome || !this.cor || !this.categoria || !this.imagem || !this.preco || !this.quantidade) {
      let errorMessage = 'Por favor, corrija os erros nos campos seguintes:';
      if (!this.nome) errorMessage += '\n- Nome';
      if (!this.preco) errorMessage += '\n- Preco';
      if (!this.quantidade) errorMessage += '\n- Quantidade';
      if (this.precoInvalido) errorMessage += '\n- Preço (inválido)';
      if (this.quantidadeInvalida) errorMessage += '\n- Quantidade (inválida)';
      if (!this.cor) errorMessage += '\n- Cor';
      if (!this.categoria) errorMessage += '\n- Categoria';
      if (!this.imagem) errorMessage += '\n- Imagem';
      
      const alert = await this.alertController.create({
        header: 'Erro de Validação',
        message: errorMessage,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Exibe uma confirmação antes de adicionar o produto
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
              nome: this.nome,
              imagemCarregada: this.imagem ?? "",
              preco: this.preco,
              quantidade: this.quantidade,
              tamanho: this.tamanho,
              cor: this.cor,
              categoria: this.categoria,
              imagem: ''
            };
            const data = await this.supabase.adicionarProduto(produto);
            if (data) {
              this.supabase.mostrarMensagem('Produto adicionado à lista!');
              this.route.navigateByUrl('/tabs/loja');
            }
          }
        }
      ]
    });
    await alert.present();
  }
  
  // Método para cancelar a adição do produto
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

  // Método para escolher uma imagem 
  async escolherImagem() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    const uploadedImageUrl = await this.supabase.uploadImage(image);

    if (uploadedImageUrl) {
      this.imagem = uploadedImageUrl;
    } else {
      const alert = await this.alertController.create({
        header: 'Erro ao carregar imagem',
        message: 'Ocorreu um erro ao carregar a imagem. Por favor, tente novamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Métodos para carregar as cores e categorias do serviço Supabase
  async carregarCores() {
    this.cores = await this.supabase.getCores();
  }

  async carregarCategorias() {
    this.categorias = await this.supabase.getCategorias();
  }

  // Método para alternar a exibição do formulário de nova categoria
  toggleNovaCategoriaForm() {
    this.mostrarFormularioNovaCategoria = !this.mostrarFormularioNovaCategoria;
  }

  // Método para adicionar uma nova categoria
  async adicionarCategoria(nomeCategoria: string) {
    const { data, error } = await this.supabase.adicionarCategoria({
      nome: nomeCategoria,
    });

    if (error) {
      console.error('Erro ao adicionar categoria TS:', error);
    } else {
      this.categorias.push(data);
      this.popController.dismiss();
      this.carregarCategorias();
    }
  }

  // Método para cancelar a criação de uma nova categoria
  cancelarCriacaoCategoria() {
    this.popController.dismiss();
  }

  // Métodos para confirmar ou cancelar a imagem selecionada
  async confirmarImagem() {
    await this.popController.dismiss();
    this.imagemClass = this.imagem;
  }

  async cancelarImagem() {
    await this.popController.dismiss();
    this.imagem = '';
  }

  // Método para remover a imagem selecionada
  removerImagem() {
    this.imagem = '';
  }
  
  // Métodos para validar o preço e a quantidade
  validarPreco() {
    const regex = /^\d+(\.\d{1,2})?$/;
    this.precoInvalido = !regex.test(this.preco);
  }

  validarQuantidade() {
    const regex = /^\d+$/;
    this.quantidadeInvalida = !regex.test(this.quantidade);
  }

  // Métodos para validar a entrada de números nos campos de preço e quantidade
  validarNumero(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
    }
  }

  validarPrecoInput(event: any) {
    const pattern = /^[0-9]*\.?[0-9]*$/;
    const input = event.target.value;

    if (!pattern.test(input)) {
      event.target.value = input.replace(/[^0-9.]/g, '');
    }
  }

  validarQuantidadeInput(event: any) {
    const pattern = /^[0-9]*$/;
    const input = event.target.value;

    if (!pattern.test(input)) {
      event.target.value = input.replace(/[^0-9]/g, '');
    }
  }
}
