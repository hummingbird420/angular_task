import { InjectionToken } from '@angular/core';

export interface TooltipOptionInfo {
  placement?: string;
  autoPlacement?: boolean;
  contentType?: 'string' | 'html' | 'template';
  delay?: number;
  showDelay?: number;
  hideDelay?: number;
  hideDelayMobile?: number;
  hideDelayTouchscreen?: number;
  zIndex?: number;
  animationDuration?: number;
  animationDurationDefault?: number;
  trigger?: string;
  tooltipClass?: string;
  display?: boolean;
  displayMobile?: boolean;
  displayTouchscreen?: boolean;
  shadow?: boolean;
  theme?: 'dark' | 'light';
  offset?: number;
  width?: string;
  maxWidth?: string;
  id?: string | number;
  hideDelayAfterClick?: number;
  pointerEvents?: 'auto' | 'none';
  position?: { top: number; left: number };
}

export const defaultOptions = {
  placement: 'top',
  autoPlacement: true,
  contentType: 'string',
  showDelay: 0,
  hideDelay: 300,
  hideDelayMobile: 0,
  hideDelayTouchscreen: 0,
  zIndex: 0,
  animationDuration: 300,
  animationDurationDefault: 300,
  trigger: 'hover',
  tooltipClass: '',
  display: true,
  displayMobile: true,
  displayTouchscreen: true,
  shadow: true,
  theme: 'light',
  offset: 8,
  maxWidth: '',
  id: false,
  hideDelayAfterClick: 2000,
};

export const backwardCompatibilityOptions: any = {
  delay: 'showDelay',
  hideDelayMobile: 'hideDelayTouchscreen',
  displayMobile: 'displayTouchscreen',
};

export const TooltipOptionsService = new InjectionToken<TooltipOptionInfo>(
  'TooltipOptionInfo'
);
