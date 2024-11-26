import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log = () => {};
  }
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => {
    if (environment.production) {
      //TODO we need to implement a method to log production error instead of print in the console.
      console.error(err);
    } else {
      console.error(err);
    }
  });
