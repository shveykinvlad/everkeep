import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Header } from '../constants/header';
import { RegistrationRequest } from '../models/registration-request';

const USERS_URL: string = `${environment.apiUrl}/users`;
const CONFIRMATION_URL: string = `${USERS_URL}/confirmation`;
const PASSWORD_URL: string = `${USERS_URL}/password`;
const EMAIL_PARAM: string = 'email';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() authenticated: EventEmitter<boolean> = new EventEmitter();
  @Output() userEmail: EventEmitter<string> = new EventEmitter();

  constructor(
    private http: HttpClient
  ) { }

  register(requestPayload: RegistrationRequest): Observable<void> {
    return this.http.post<void>(USERS_URL, requestPayload);
  }

  resendConfirmation(email: string): Observable<void> {
    return this.http.get<void>(CONFIRMATION_URL, {
      params: new HttpParams()
        .set(EMAIL_PARAM, email)
    });
  }

  applyConfirmation(token: string): Observable<void> {
    return this.http.post<void>(CONFIRMATION_URL, null, {
      headers: new HttpHeaders()
        .set(Header.X_API_KEY, token),
    });
  }

  resetPassword(email: string): Observable<void> {
    return this.http.delete<void>(PASSWORD_URL, {
      params: new HttpParams()
        .set(EMAIL_PARAM, email)
    });
  }

  updatePassword(requestPayload: RegistrationRequest, token: string): Observable<void> {
    return this.http.post<void>(PASSWORD_URL, requestPayload, {
      headers: new HttpHeaders()
        .set(Header.X_API_KEY, token),
    });
  }
}
