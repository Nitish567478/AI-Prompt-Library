import { Routes } from '@angular/router';

import { AddPromptComponent } from './components/add-prompt/add-prompt.component';
import { LoginComponent } from './components/login/login.component';
import { PromptDetailComponent } from './components/prompt-detail/prompt-detail.component';
import { PromptListComponent } from './components/prompt-list/prompt-list.component';
import { SignupComponent } from './components/signup/signup.component';


export const routes: Routes = [
  { path: '', component: PromptListComponent },
  { path: 'add', component: AddPromptComponent },
  { path: 'prompt/:id', component: PromptDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];
