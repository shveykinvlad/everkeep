import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { AuthGuard as AuthGuard } from 'src/app/guards/auth.guard';
import { NotesComponent } from './components/notes/notes.component';
import { NoteDetailsComponent } from './components/note-details/note-details.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';

const routes: Routes = [
  { path: 'users/login', component: LoginComponent },
  { path: 'users/register', component: RegistrationComponent },
  { path: 'users/confirm', component: ConfirmationComponent },
  { path: 'users/password/reset', component: ResetPasswordComponent },
  { path: 'users/password/update', component: UpdatePasswordComponent },
  { path: '', component: NotesComponent, canActivate: [AuthGuard] },
  { path: 'notes', component: NotesComponent, canActivate: [AuthGuard] },
  { path: 'notes/:id', component: NoteDetailsComponent, canActivate: [AuthGuard] },
  { path: 'notes/add', component: NoteDetailsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
