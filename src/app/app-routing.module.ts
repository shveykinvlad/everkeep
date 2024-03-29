import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { LoginComponent } from './components/login/login.component';
import { NoteDetailsComponent } from './components/note-details/note-details.component';
import { NotesComponent } from './components/notes/notes.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PasswordUpdateComponent } from './components/password-update/password-update.component';

const routes: Routes = [
  { path: 'users/login', component: LoginComponent },
  { path: 'users/registration', component: RegistrationComponent },
  { path: 'users/confirmation', component: ConfirmationComponent },
  { path: 'users/password/reset', component: PasswordResetComponent },
  { path: 'users/password/update', component: PasswordUpdateComponent },
  { path: '', component: NotesComponent, canActivate: [AuthGuard] },
  { path: 'notes', component: NotesComponent, canActivate: [AuthGuard] },
  { path: 'notes/:id', component: NoteDetailsComponent, canActivate: [AuthGuard] },
  { path: 'notes/add', component: NoteDetailsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
