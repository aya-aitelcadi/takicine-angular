import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="toast.type" (click)="toastService.remove(toast.id)">
          <span class="toast-icon">{{ toast.icon }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
          <div class="toast-progress"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 2rem; right: 2rem;
      z-index: 5000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      background: var(--noir-3);
      border: 1px solid var(--border);
      border-radius: 10px;
      box-shadow: var(--shadow);
      font-size: 0.875rem;
      color: var(--text-primary);
      min-width: 280px;
      cursor: pointer;
      animation: toastIn 0.3s ease;
      position: relative;
      overflow: hidden;
      &.success { border-left: 3px solid var(--accent-green); }
      &.error { border-left: 3px solid var(--accent-red); }
      &.info { border-left: 3px solid var(--accent-blue); }
      &.warning { border-left: 3px solid var(--gold); }
    }
    .toast-progress {
      position: absolute;
      bottom: 0; left: 0;
      height: 2px;
      background: var(--gold);
      animation: progress 3.2s linear forwards;
    }
    .success .toast-progress { background: var(--accent-green); }
    .error .toast-progress { background: var(--accent-red); }
    .info .toast-progress { background: var(--accent-blue); }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
