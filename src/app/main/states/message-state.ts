import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { RecipientInfo, Recipients, SortedFieldInfo } from 'src/app/models';
import { DropDownModel } from 'src/app/models/filter-dropdown';

import { MessageService } from 'src/app/services/message.service';

export interface RecipientsModel {
  classRecipients: RecipientInfo;
  campusField: DropDownModel;
  selectedRecipient: Recipients[];
}

export class UpdateFilterDropdownInfo {
  static readonly type = '[MessageState] UpdateFilterDropdownInfo';
  constructor() {}
}

export class UpdateRecipientInfo {
  static readonly type = '[MessageState] UpdateRecipientInfo';
  constructor() {}
}

export class UpdateSelectedRecipient {
  static readonly type = '[MessageState] UpdateSelectedRecipient';
  constructor(public selectedRecipient: Recipients[]) {}
}

@State<RecipientsModel>({
  name: 'appmessagestate',
  defaults: {
    classRecipients: {} as RecipientInfo,
    campusField: {} as DropDownModel,
    selectedRecipient: [],
  },
})
@Injectable()
export class MessageState {
  constructor(private messageService: MessageService) {}
  @Selector()
  static getRecipientNavigation(recipientModel: RecipientsModel) {
    return recipientModel.classRecipients.navigationField;
  }
  @Selector()
  static getRecipientButton(recipientModel: RecipientsModel) {
    return recipientModel.classRecipients.buttons;
  }

  @Selector()
  static getRecipientColumns(recipientModel: RecipientsModel) {
    return recipientModel.classRecipients.columns;
  }

  @Selector()
  static getRecipientRow(recipientModel: RecipientsModel) {
    return recipientModel.classRecipients.studentRecipients;
  }
  @Selector()
  static getSelectedRecipients(recipientModel: RecipientsModel) {
    return recipientModel.selectedRecipient;
  }

  @Selector()
  static getCampusField(recipientModel: RecipientsModel) {
    return recipientModel.campusField;
  }
  @Action(UpdateFilterDropdownInfo)
  updateFilterDropdownInfo(ctx: StateContext<RecipientsModel>, action: UpdateFilterDropdownInfo) {
    return this.messageService.getFilterDropdown().subscribe((dropdown) => {
      ctx.patchState({ campusField: dropdown });
    });
  }

  @Action(UpdateRecipientInfo)
  updateRecipientInfo(ctx: StateContext<RecipientsModel>, action: UpdateRecipientInfo) {
    return this.messageService.getRecipient().pipe(tap((recipient) => ctx.patchState({ classRecipients: recipient })));
  }

  @Action(UpdateSelectedRecipient)
  updateSelectedRecipient(ctx: StateContext<RecipientsModel>, action: UpdateSelectedRecipient) {
    ctx.patchState({ selectedRecipient: action.selectedRecipient });
  }
}
