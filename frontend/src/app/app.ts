import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/component/header/presentational/header.component';
import { ToastsComponent } from './core/component/toast/toasts.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ToastsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
}
