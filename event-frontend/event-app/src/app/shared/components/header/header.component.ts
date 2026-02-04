import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  get isStaff(): boolean {
    const role = this.authService.currentUserValue?.role?.toLowerCase();
    return role === 'admin' || role === 'staff';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
