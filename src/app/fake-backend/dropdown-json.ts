import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DropdownInfo {
  getDropdown() {
    return {
      fieldName: 'levelId',
      fieldTitle: 'Department',
      fieldValue: '',
      options: [
        { value: 1, title: 'Robotics Department' },
        { value: 2, title: 'AI Department' },
      ],
    };
  }
}
