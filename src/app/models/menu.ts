import { MenuItem } from './menu-item';

export interface Menu {
  menuId: string;
  menuLabel: string;
  menuItems: MenuItem[];
}
