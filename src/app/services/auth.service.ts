import { Injectable, signal } from '@angular/core';
import { User } from '../models/film.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  user = this._user.asReadonly();

  login(user: User): void {
    this._user.set({ ...user, points: 0 });
  }

  logout(): void {
    this._user.set(null);
  }

  updateUser(updates: Partial<User>): void {
    this._user.update(u => u ? { ...u, ...updates } : null);
  }

  addPoints(pts: number): void {
    this._user.update(u => u ? { ...u, points: u.points + pts } : null);
  }

  get isLoggedIn(): boolean {
    return this._user() !== null;
  }
}
