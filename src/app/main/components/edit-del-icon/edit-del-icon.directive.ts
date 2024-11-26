import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { EditDelIconComponent } from './edit-del-icon.component';

@Directive({
  selector: '[oEditDelIcon]',
})
export class EditDelIconDirective implements OnInit {
  constructor(
    private cfResolver: ComponentFactoryResolver,
    private viewContainer: ViewContainerRef,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    console.log('edit delete directivee');

    const cFactory =
      this.cfResolver.resolveComponentFactory(EditDelIconComponent);
    const component = this.viewContainer.createComponent(cFactory);
    this.renderer.appendChild(this.elementRef.nativeElement, component);
  }
}
