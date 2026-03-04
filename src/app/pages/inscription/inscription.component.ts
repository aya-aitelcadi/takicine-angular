import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {
  auth = inject(AuthService);
  toast = inject(ToastService);
  router = inject(Router);
  fb = inject(FormBuilder);

  mode = signal<'signup' | 'login'>('signup');

  signupForm: FormGroup = this.fb.group({
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    nom: ['', [Validators.required, Validators.minLength(2)]],
    age: [null, [Validators.min(1), Validators.max(120)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  sf(name: string) { return this.signupForm.get(name); }
  lf(name: string) { return this.loginForm.get(name); }

  toggleMode(): void {
    this.mode.update(m => m === 'signup' ? 'login' : 'signup');
  }

  submitSignup(): void {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.invalid) return;
    const v = this.signupForm.value;
    this.auth.login({ prenom: v.prenom, nom: v.nom, age: v.age, email: v.email, points: 0 });
    this.toast.show('success', `Bienvenue ${v.prenom} ! 🎬`, '👋');
    this.router.navigate(['/profil']);
  }

  submitLogin(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;
    const v = this.loginForm.value;
    this.auth.login({ prenom: 'Cinéphile', nom: '', age: null, email: v.email, points: 50 });
    this.toast.show('success', 'Connexion réussie !', '🎬');
    this.router.navigate(['/profil']);
  }
}
