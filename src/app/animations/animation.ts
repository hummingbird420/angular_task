import {
  style,
  animate,
  trigger,
  transition,
  state,
} from '@angular/animations';

const CUBIC_BEZIER_ANIMATION = '225ms cubic-bezier(0.4,0.0,0.2,1)';
const EASE_IN_ANIMATION = '225ms ease-in';
const EASE_OUT_ANIMATION = '225ms ease-out';

export const rotate = (
  name: string,
  state1: string,
  state2: string,
  rotate: number
) =>
  trigger(name, [
    state(
      state1,
      style({
        transform: 'rotate(0deg)',
      })
    ),
    state(
      state2,
      style({
        transform: 'rotate(' + rotate + 'deg)',
      })
    ),
    transition(state1 + ' => ' + state2, [animate('0.25s ease')]),
    transition(state2 + ' => ' + state1, [animate('0.25s ease')]),
  ]);

export const openClose = trigger('openClose', [
  state(
    'open',
    style({
      width: '*',
      overflow: '*',
    })
  ),
  state(
    'closed, void',
    style({
      width: '40px',
      overflow: 'hidden',
    })
  ),

  transition(
    'open <=> closed, void => closed',
    animate(CUBIC_BEZIER_ANIMATION)
  ),
]);

export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)' }),
    animate(EASE_IN_ANIMATION, style({ transform: 'translateY(0%)' })),
  ]),
  transition(':leave', [
    animate(EASE_OUT_ANIMATION, style({ transform: 'translateY(-100%)' })),
  ]),
]);

export const collapseUpDown = trigger('collapseUpDown', [
  state(
    'collapsed, void',
    style({
      overflow: 'hidden',
      opacity: 0.0,
      height: '0px',
      visibility: 'hidden',
    })
  ),
  state(
    'expanded',
    style({ overflow: '*', opacity: '*', height: '*', visibility: 'visible' })
  ),
  transition(
    'expanded <=> collapsed, void => collapsed',
    animate(CUBIC_BEZIER_ANIMATION)
  ),
]);
