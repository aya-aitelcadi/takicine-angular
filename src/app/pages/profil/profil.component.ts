import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {
  auth = inject(AuthService);
  toast = inject(ToastService);
  router = inject(Router);
  fb = inject(FormBuilder);

  activeTab = signal<'infos' | 'points'>('infos');
  showEditModal = signal(false);

  editForm: FormGroup = this.fb.group({
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    nom: [''],
    age: [null],
    email: ['', [Validators.required, Validators.email]]
  });

  openEdit(): void {
    const u = this.auth.user()!;
    this.editForm.patchValue(u);
    this.showEditModal.set(true);
  }

  saveEdit(): void {
    if (this.editForm.invalid) return;
    this.auth.updateUser(this.editForm.value);
    this.showEditModal.set(false);
    this.toast.show('success', 'Profil mis à jour !', '✅');
  }

  logout(): void {
    this.auth.logout();
    this.toast.show('info', 'À bientôt !', '👋');
    this.router.navigate(['/']);
  }

  get initials(): string {
    const u = this.auth.user();
    if (!u) return '?';
    return `${u.prenom[0]}${u.nom?.[0] || ''}`.toUpperCase();
  }
}
