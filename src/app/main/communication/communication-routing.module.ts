import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipientResolver } from 'src/app/resolvers/recipient.resolver';
import { MessageComponent } from './message/message.component';
import { NewMessageComponent } from './message/new-message/new-message.component';

const routes: Routes = [
  {
    path: 'messages',
    component: MessageComponent,
  },
  {
    path: 'new-messages',
    component: NewMessageComponent,
    resolve: { recipient: RecipientResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationRoutingModule {}
