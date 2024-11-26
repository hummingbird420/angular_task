import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store, UpdateState } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { UpdateFilterDropdownInfo, UpdateRecipientInfo } from '../main/states/message-state';
import { MessageService } from '../services/message.service';

@Injectable({
  providedIn: 'root',
})
export class RecipientResolver implements Resolve<any> {
  constructor(private store: Store, private messageService: MessageService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.updateState();
  }
  updateState() {
    //return of(true);
    return this.store.dispatch([new UpdateRecipientInfo(), new UpdateFilterDropdownInfo()]);
  }
}
