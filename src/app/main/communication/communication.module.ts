import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunicationRoutingModule } from './communication-routing.module';

import { MessageComponent } from './message/message.component';
import { MessageBodyComponent } from './message/message-body.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MessageFolderComponent } from './message/message-folder.component';
import { NewMessageComponent } from './message/new-message/new-message.component';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentModule } from '../components/component.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AddRecipientDialog } from './message/new-message/add-recipient.dialog';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  declarations: [
    MessageComponent,
    MessageBodyComponent,
    MessageFolderComponent,
    NewMessageComponent,
    AddRecipientDialog,
  ],
  imports: [
    CommonModule,
    CommunicationRoutingModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatDividerModule,
    ComponentModule,
    MatDialogModule,
    MatMenuModule,
  ],
})
export class CommunicationModule {}
