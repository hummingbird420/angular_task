import {
  Compiler,
  Component,
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  Injector,
  Input,
  NgModule,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Directive({
  selector: '[oInnerAngularHtml]',
})
export class InnerAngularHtmlDirective {
  private _innerAngularHtml!: SafeHtml;

  @Input('innerAngularHtml') set innerAngularHtml(value: SafeHtml) {
    /* if (!value || !value['changingThisBreaksApplicationSecurity']) {
      throw new Error(
        'innerAngularHtml support SafeHtml Only, use sanitizer.bypassSecurityTrustHtml'
      );
    }*/
    this._innerAngularHtml = value;
  }
  get innerAngularHtml() {
    return this._innerAngularHtml;
  }

  @HostBinding('class') @Input('class') classList: string = '';

  private _componentRef!: ComponentRef<any>;

  constructor(
    private _compiler: Compiler,
    private _injector: Injector,
    private el: ElementRef,
    private renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef
  ) {
    console.log('constructor');
  }

  ngOnInit() {
    console.log('onInit');
    const template: string = '';
    //  this.innerAngularHtml['changingThisBreaksApplicationSecurity'];// TODO we need to fix it later
    const templateWithRouterLink = template?.replace(
      new RegExp('href="(?=[/.])'),
      'routerLink="'
    ); // TODO replace with better regex
    const tmpCmp = Component({ template: templateWithRouterLink })(
      class DynamicComponent {}
    );

    this._viewContainerRef.clear();
    // this._componentRef = null;

    if (tmpCmp) {
      const tmpModule = NgModule({
        declarations: [tmpCmp],
        imports: [RouterModule],
      })(class {});
      this._compiler
        .compileModuleAndAllComponentsAsync(tmpModule)
        .then((module) => {
          const ngModuleRef = module.ngModuleFactory.create(this._injector);
          const componentFactory = module.componentFactories[0];
          this._componentRef = componentFactory.create(
            this._injector,
            [],
            null,
            ngModuleRef
          );
          if (this.classList) {
            this.renderer.addClass(
              this._componentRef.location.nativeElement,
              this.classList
            );
          }
          this._viewContainerRef.insert(this._componentRef.hostView);
          const parentNode = this.renderer.parentNode(this.el.nativeElement);
          this.renderer.removeChild(parentNode, this.el.nativeElement);
        });
    }
  }

  ngOnDestroy() {
    if (this._componentRef) {
      this._componentRef.destroy();
    }
  }
}
