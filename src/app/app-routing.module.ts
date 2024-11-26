import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { E404Page } from './errors/e404.page';
import { SessionResolver } from './resolvers/session.resolver';
import { DictionaryResolve } from './services/dictionary.resolve';
import { AuthGuard } from './util';

const authModule = () => import('./auth/auth.module').then((m) => m.AuthModule);
const mainModule = () => import('./main/main.module').then((m) => m.MainModule);
const shoppingCartModule = () => import('./shopping-cart/shopping-cart.module').then((m) => m.ShoppingCartModule);

const routes: Routes = [
  { path: 'auth', loadChildren: authModule },
  {
    path: '',
    loadChildren: mainModule,
    resolve: { sessionId: SessionResolver, dictionaryResolve: DictionaryResolve },
    data: {
      words: [
        'Logout',
        'Live Help',
        'Search',
        'Start Page',
        'Right Menu',
        'is invalid.',
        'Maximum length',
        'Minimum value',
        'Maximum value',
        'Please select at least one.',
        'is required.',
        'Save',
        'Update',
        'Delete',
        'Cancel',
        'Back',
        'Remove',
        'Add',
        'Edit',
      ],
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'shopping-cart',
    loadChildren: shoppingCartModule,
    resolve: { sessionId: SessionResolver },
    data: { multiple: false },
  },
  {
    path: 'shopping-cart/multiple',
    loadChildren: shoppingCartModule,
    resolve: { sessionId: SessionResolver },
    data: { multiple: true },
  },
  { path: '**', component: E404Page },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: '/einstein-galactic' }],
})
export class AppRoutingModule {}
