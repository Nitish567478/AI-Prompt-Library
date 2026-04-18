import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Prompt, PromptService } from '../../services/prompt.service';


@Component({
  selector: 'app-prompt-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prompt-detail.component.html',
  styleUrls: ['./prompt-detail.component.css']
})
export class PromptDetailComponent implements OnInit {
  prompt: Prompt | null = null;
  isDeleting = false;
  copied = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: PromptService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      this.service.getPrompt(id).subscribe({
        next: (data) => {
          this.prompt = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
        }
      });
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getComplexityLevel(complexity: number): 'easy' | 'medium' | 'hard' {
    if (complexity <= 3) {
      return 'easy';
    }

    if (complexity <= 7) {
      return 'medium';
    }

    return 'hard';
  }

  copyPrompt(content?: string) {
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content).then(() => {
      this.copied = true;
      this.cdr.detectChanges();

      window.setTimeout(() => {
        this.copied = false;
        this.cdr.detectChanges();
      }, 1800);
    }).catch((err) => {
      console.error(err);
    });
  }

  deletePrompt(id?: number) {
    if (!id || this.isDeleting) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this prompt?');
    if (!confirmed) {
      return;
    }

    this.isDeleting = true;

    this.service.deletePrompt(id).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.isDeleting = false;
      }
    });
  }
}
