import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-toast />
  `,
  styles: [`
    main { padding-top: 64px; min-height: 100vh; }
  `]
})
export class AppComponent {}
