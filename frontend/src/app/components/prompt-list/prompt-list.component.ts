import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptService, Prompt } from '../../services/prompt.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prompt-list.component.html'
})
export class PromptListComponent implements OnInit {

  prompts: Prompt[] = [];
  deletingId: number | null = null;

  constructor(
    private service: PromptService,
    private cdr: ChangeDetectorRef   // ✅ IMPORTANT
  ) {}

  ngOnInit() {
    this.service.getPrompts().subscribe({
      next: (data: Prompt[]) => {
        console.log("DATA RECEIVED:", data);

        this.prompts = data;

        this.cdr.detectChanges();   // 🔥 FORCE UI UPDATE
      },
      error: (err) => console.error(err)
    });
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

  deletePrompt(event: Event, id?: number) {
    event.stopPropagation();

    if (!id || this.deletingId === id) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this prompt?');
    if (!confirmed) {
      return;
    }

    this.deletingId = id;

    this.service.deletePrompt(id).subscribe({
      next: () => {
        this.prompts = this.prompts.filter((prompt) => prompt.id !== id);
        this.deletingId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.deletingId = null;
      }
    });
  }
}
