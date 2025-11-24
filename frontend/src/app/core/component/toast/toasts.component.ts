import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../modals/toast.modals';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss'],
  imports: [NgClass],
})
export class ToastsComponent {
  private _toastService = inject(ToastService);

  public toasts = this._toastService.toasts;

  public removeToast(toast: Toast): void {
    this._toastService.remove(toast);
  }
}
