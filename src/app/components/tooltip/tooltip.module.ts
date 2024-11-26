import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import {
  TooltipOptionInfo,
  TooltipOptionsService,
} from './tooltip.options';

@NgModule({
  declarations: [TooltipComponent, TooltipDirective],
  imports: [CommonModule],
  exports: [TooltipDirective],
  entryComponents: [TooltipComponent],
})
export class TooltipModule {
  static forRoot(
    initOptions: TooltipOptionInfo
  ): ModuleWithProviders<TooltipModule> {
    return {
      ngModule: TooltipModule,
      providers: [
        {
          provide: TooltipOptionsService,
          useValue: initOptions,
        },
      ],
    };
  }
}
