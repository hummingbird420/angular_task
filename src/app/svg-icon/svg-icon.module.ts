import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { SvgIconDirective } from './svg-icon.directive';

@NgModule({
  declarations: [SvgIconDirective],
  imports: [CommonModule],
  providers: [MatIconRegistry],
  exports: [SvgIconDirective],
})
export class SvgIconModule {
  private rootPath = './assets/svg';
  constructor(
    private domSanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry
  ) {
    this.matIconRegistry
      .addSvgIcon('alert', this.setPath(`${this.rootPath}/alert.svg`))
      .addSvgIcon('back', this.setPath(`${this.rootPath}/back_default.svg`))
      .addSvgIcon(
        'backDisable',
        this.setPath(`${this.rootPath}/back_disabled.svg`)
      )
      .addSvgIcon('backHover', this.setPath(`${this.rootPath}/back_hover.svg`))
      .addSvgIcon(
        'backPressed',
        this.setPath(`${this.rootPath}/back_pressed.svg`)
      )
      .addSvgIcon('cart', this.setPath(`${this.rootPath}/cart_default.svg`))
      .addSvgIcon('cartHover', this.setPath(`${this.rootPath}/cart_hover.svg`))
      .addSvgIcon(
        'cartSelected',
        this.setPath(`${this.rootPath}/cart_bag_selected.svg`)
      )
      .addSvgIcon('cartItems', this.setPath(`${this.rootPath}/cart_items.svg`))

      .addSvgIcon('done', this.setPath(`${this.rootPath}/done.svg`))
      .addSvgIcon('error', this.setPath(`${this.rootPath}/error.svg`))
      .addSvgIcon(
        'chevronDown',
        this.setPath(`${this.rootPath}/icon_chevron-down.svg`)
      )
      .addSvgIcon(
        'chevronUp',
        this.setPath(`${this.rootPath}/icon_chevron-up.svg`)
      )
      .addSvgIcon('info', this.setPath(`${this.rootPath}/info.svg`))
      .addSvgIcon('login', this.setPath(`${this.rootPath}/login_default.svg`))
      .addSvgIcon('filters', this.setPath(`${this.rootPath}/filters.svg`))
      .addSvgIcon('delete', this.setPath(`${this.rootPath}/delete_icon.svg`));
  }
  private setPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
