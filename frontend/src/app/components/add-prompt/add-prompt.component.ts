import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { PromptService } from '../../services/prompt.service';


@Component({
  selector: 'app-add-prompt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-prompt.component.html'
})
export class AddPromptComponent {
  form: FormGroup;
  errorMessage = '';
  currentUser$;

  constructor(
    private fb: FormBuilder,
    private service: PromptService,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;

    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      complexity: [1, Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.authService.currentUser) {
      this.errorMessage = 'Please login first to add your own prompt.';
      return;
    }

    const data = {
      title: this.form.value.title || '',
      content: this.form.value.content || '',
      complexity: this.form.value.complexity || 1
    };

    this.errorMessage = '';

    this.service.createPrompt(data).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Could not create prompt.';
      }
    });
  }
}
