import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SetupPage } from './setup.page';
import { AccountProfilePage, UserFeaturesPage, PaymentPlanPage } from '.';

import { SystemOptionsPage } from './system-options/system-options.page';
import { SemestersPage } from './semester/semesters.page';
import { SemesterInfoPage } from './semester/semester-info.page';
import { DisplayOptionsPage } from './display-options/display-options.page';
import { StartPageSetupPage } from './start-page-setup/start-page-setup.page';
import { AdditionalSetupPage } from './additional-setup/additional-setup.page';
import { PaymentSetupPage } from './payment/payment-setup.page';
import { DictionaryResolve } from 'src/app/services/dictionary.resolve';
import { StartPageQueryPage } from './start-page-setup/start-page-query.page';
const shoppingCartSetupModule = () =>
  import('./shopping-cart-setup/shopping-cart-setup.module').then(
    (m) => m.ShoppingCartSetupModule
  );
const tuitionAndFeesModule = () =>
  import('./tuition-and-fees/tuition-and-fees.module').then(
    (m) => m.TuitionAndFeesModule
  );
const routes = [
  {
    path: '',
    resolve: { dictionaryResolve: DictionaryResolve },
    data: {
      words: ['Setup & Customization', 'Customization'],
    },
    component: SetupPage,
    children: [
      { path: '', redirectTo: '/account-profile', pathMatch: 'full' },
      { path: 'account-profile', component: AccountProfilePage },
      { path: 'user-features', component: UserFeaturesPage },
      { path: 'system-options', component: SystemOptionsPage },
      { path: 'display-options', component: DisplayOptionsPage },

      { path: 'start-page-setup', component: StartPageSetupPage },
      { path: 'new-start-page-query', component: StartPageQueryPage },
      { path: 'start-page-query/:id', component: StartPageQueryPage },

      { path: 'additional-setup', component: AdditionalSetupPage },
      { path: 'shopping-cart-setup', loadChildren: shoppingCartSetupModule },
      { path: 'payment-setup', component: PaymentSetupPage },

      { path: 'semesters', component: SemestersPage },
      { path: 'semester-info/:id', component: SemesterInfoPage },
      { path: 'new-semester', component: SemesterInfoPage },

      { path: 'tuition-and-fees', loadChildren: tuitionAndFeesModule },

      { path: 'payment-plans', component: PaymentPlanPage },
      {
        path: 'customization',
        loadChildren: () =>
          import('./customization/customization.module').then(
            (m) => m.CustomizationModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
