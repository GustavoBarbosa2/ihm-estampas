import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'loja',
        loadChildren: () => import('../loja/loja.module').then(m => m.LojaPageModule)
      },
      {
        path: 'conta',
        loadChildren: () => import('../conta/conta.module').then( m => m.ContaPageModule)
      },
      {
        path: 'carrinho',
        loadChildren: () => import('../carrinho/carrinho.module').then( m => m.CarrinhoPageModule)
      },
      {
        path: 'favoritos',
        loadChildren: () => import('../favoritos/favoritos.module').then( m => m.FavoritosPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/loja',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
