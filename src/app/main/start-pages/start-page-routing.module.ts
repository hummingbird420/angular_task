import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartPage, DashboardPage } from '.';

const routes: Routes = [
  {
    path: '',
    component: StartPage,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPage },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartPageRoutingModule {}
