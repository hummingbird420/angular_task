import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { DictionaryService } from './dictionary.service';

@Injectable({
  providedIn: 'root',
})
export class DictionaryResolve implements Resolve<any> {
  constructor(private dictionaryService: DictionaryService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    route.data['words'];
    this.dictionaryService.loadTranslatedWords(route.data['words']);
  }
}
