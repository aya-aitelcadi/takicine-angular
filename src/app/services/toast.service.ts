import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();
  private _nextId = 1;

  show(type: Toast['type'], message: string, icon?: string): void {
    const icons: Record<Toast['type'], string> = {
      success: '✅', error: '🗑️', info: 'ℹ️', warning: '⚠️'
    };
    const toast: Toast = { id: this._nextId++, type, message, icon: icon || icons[type] };
    this._toasts.update(t => [...t, toast]);
    setTimeout(() => this.remove(toast.id), 3200);
  }

  remove(id: number): void {
    this._toasts.update(t => t.filter(x => x.id !== id));
  }
}
