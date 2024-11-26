import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ClassInfo, MADisplayCartStudentInfo } from '../models';
import { RemoveFromCart, ShoppingCartState, UpdateMADisplayCartStudents } from '../cart-states';

@Directive({
  selector: '[removeCartItem]',
})
export class RemoveCartItemDirective implements OnInit {
  @Input() removeCartItem!: ClassInfo;
  @Input() multiple: boolean = false;

  @Select(ShoppingCartState.maDisplayCartStudents)
  maDisplayCartStudents$!: Observable<MADisplayCartStudentInfo[]>;
  maDisplayCartStudents: MADisplayCartStudentInfo[] = [];

  constructor(private store: Store) {}
  ngOnInit(): void {
    this.maDisplayCartStudents$.pipe(take(1)).subscribe((students) => {
      this.maDisplayCartStudents = students;
    });
  }

  @HostListener('click') onClick() {
    if (this.multiple) {
      if (this.removeCartItem) {
        const name = this.removeCartItem.name || '';
        const dateOfBirth = this.removeCartItem.dateOfBirth || '';
        const email = this.removeCartItem.email || '';

        let index = -1;
        for (let i = 0; i < this.maDisplayCartStudents.length; i++) {
          const student = this.maDisplayCartStudents[i];
          if (!student) continue;
          const studentName = student.lastName + ', ' + student.firstName;
          if (student.email === email && student.dateOfBirth === dateOfBirth && studentName === name) {
            index = i;
            break;
          }
        }

        if (index > -1) {
          const students = [];
          for (let i = 0; i < this.maDisplayCartStudents.length; i++) {
            if (i === index) {
              const student = this.cloneMaDisplayCartStudents(this.maDisplayCartStudents[i]);
              const classIds = student.classIds.filter((classId) => classId !== this.removeCartItem.classId);
              if (classIds.length > 0) {
                student.classIds = classIds;
                students.push(student);
              }
            } else {
              students.push(this.cloneMaDisplayCartStudents(this.maDisplayCartStudents[i]));
            }
          }

          this.store.dispatch(new UpdateMADisplayCartStudents(students, true));
        }
      }
    } else {
      this.store.dispatch(new RemoveFromCart(this.removeCartItem.classId));
    }
  }

  cloneMaDisplayCartStudents(student: MADisplayCartStudentInfo): MADisplayCartStudentInfo {
    return {
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      email: student.email,
      classIds: student.classIds,
      index: student.index,
    };
  }
}
