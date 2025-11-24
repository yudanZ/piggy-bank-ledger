import { Injectable, signal } from '@angular/core';
import { Toast } from '../modals/toast.modals';

@Injectable({ providedIn: 'root' })
export class ToastService {
  public toasts = signal<Toast[]>([]);

  public show(text: string, options: Partial<Toast> = {}) {
    const newToast: Toast = { text, ...options };
    this.toasts.update((list) => [...list, newToast]);

    if (newToast.delay) {
      setTimeout(() => this.remove(newToast), newToast.delay);
    }
  }

  public remove(toast: Toast) {
    this.toasts.update((list) => list.filter((t) => t !== toast));
  }

  public success(message: string) {
    this.show(message, { classname: 'bg-success text-white', delay: 3000 });
  }

  public error(message: string) {
    this.show(message, { classname: 'bg-danger text-white', delay: 3000 });
  }

  public info(message: string) {
    this.show(message, { classname: 'bg-info text-white', delay: 3000 });
  }

  public warning(message: string) {
    this.show(message, { classname: 'bg-warning text-dark', delay: 3000 });
  }
}
