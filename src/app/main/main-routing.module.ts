import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/util';
import { MainPage } from './main.page';

const startPageModule = () => import('./start-pages/start-page.module').then((m) => m.StartPageModule);
const setupModule = () => import('./setup/setup.module').then((m) => m.SetupModule);

const communicationModule = () => import('./communication/communication.module').then((m) => m.CommunicationModule);

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      { path: '', loadChildren: startPageModule, canActivate: [AuthGuard] },
      { path: 'setup', loadChildren: setupModule, canActivate: [AuthGuard] },
      { path: '', loadChildren: communicationModule, canActivate: [AuthGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
