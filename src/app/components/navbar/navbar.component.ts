import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  auth = inject(AuthService);
  toast = inject(ToastService);
  router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.toast.show('info', 'À bientôt !', '👋');
    this.router.navigate(['/']);
  }
}
