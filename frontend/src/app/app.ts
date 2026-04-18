import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html'
})
export class AppComponent {
  currentUser$;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;

    this.authService.loadCurrentUser().subscribe({
      error: () => {
        // Keep the app usable even if the auth session check fails.
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      error: () => {
        // Ignore logout errors and let the user keep browsing.
      }
    });
  }
}
