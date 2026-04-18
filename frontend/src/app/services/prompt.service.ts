import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export interface Prompt {
  id?: number;
  title: string;
  content: string;
  complexity: number;
  views?: number;
  created_at?: string;
  level?: string;
  owner_name?: string;
  is_owner?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PromptService {

  private baseUrl = `${API_BASE_URL}/prompts/`;

  constructor(private http: HttpClient) {}

  getPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(this.baseUrl);
  }

  // ✅ FIXED (used in detail page)
  getPrompt(id: number): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.baseUrl}${id}/`);
  }

  createPrompt(data: Prompt) {
    return this.http.post(`${this.baseUrl}create/`, data, { withCredentials: true });
  }

  deletePrompt(id: number) {
    return this.http.delete(`${this.baseUrl}${id}/`, { withCredentials: true });
  }
}
