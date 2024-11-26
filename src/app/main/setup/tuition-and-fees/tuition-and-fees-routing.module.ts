import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CopyFeesPage } from './copy-fees/copy-fees.page';
import { CopyTuitionPage } from './copy-tuition/copy-tuition.page';
import { FeeSetupPage } from './fee-setup/fee-setup.page';
import { TuitionRateTypePage } from './tuition-rate-type/tuition-rate-type.page';
import { TuitionSetupPage } from './tuition-setup/tuition-setup.page';
const routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'tuitions', pathMatch: 'full' },
      { path: 'tuitions', component: TuitionSetupPage },
      { path: 'copy-tuition', component: CopyTuitionPage },
      { path: 'fees', component: FeeSetupPage },
      { path: 'copy-fees', component: CopyFeesPage },

      { path: 'tuition-rate-types', component: TuitionRateTypePage },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TuitionAndFeesRoutingModule {}
