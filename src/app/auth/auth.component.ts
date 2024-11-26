import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services';

@Component({
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  schoolName: string = '';
  logo: string = '';
  defaultLogo: string = 'assets/images/logo_blue.png';

  constructor(private authService: AuthService, private router: Router) {
    this.schoolName = 'Galactic System Login';
    this.logo = this.defaultLogo;
    if (this.router.url.endsWith('/login')) {
      this.authService.checkAuthentication().subscribe((response) => {
        if (response) {
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  ngOnInit(): void {}

  loadDefault() {
    this.logo = this.defaultLogo;
  }
}
