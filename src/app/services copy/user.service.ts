import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RegistrationRequest } from '../models/registration-request';
import { Observable } from 'rxjs';
import { SessionRequest } from '../models/session-request';
import { SessionResponse } from '../models/session-response';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Header } from '../constants/header';
import { LocalStorageItem } from '../constants/local-storage-items';

const USERS_URL: string = `${environment.apiUrl}/users`;
const CONFIRMATION_URL: string = `${USERS_URL}/confirmation`;
const PASSWORD_URL: string = `${USERS_URL}/password`;
const SESSIONS_URL: string = `${USERS_URL}/sessions`;
const EMAIL_PARAM: string = 'email';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() authenticated: EventEmitter<boolean> = new EventEmitter();
  @Output() userEmail: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient) { }

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

  createSession(requestPayload: SessionRequest): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(SESSIONS_URL, requestPayload).pipe(
      tap(sessionResponse => {
        localStorage.setItem(LocalStorageItem.ACCESS_TOKEN, sessionResponse.jwt);
        localStorage.setItem(LocalStorageItem.REFRESH_TOKEN, sessionResponse.refreshToken);
        localStorage.setItem(LocalStorageItem.USER_EMAIL, sessionResponse.email);
        this.authenticated.emit(true);
        this.userEmail.emit(sessionResponse.email);
      })
    );
  }

  refreshSession(): Observable<SessionResponse> {
    return this.http.put<SessionResponse>(SESSIONS_URL, null, {
      headers: new HttpHeaders()
        .set(Header.X_API_KEY, this.getRefreshToken()),
    }).pipe(
      tap(sessionResponse => {
        localStorage.setItem(LocalStorageItem.ACCESS_TOKEN, sessionResponse.jwt);
        localStorage.setItem(LocalStorageItem.REFRESH_TOKEN, sessionResponse.refreshToken);
        localStorage.setItem(LocalStorageItem.USER_EMAIL, sessionResponse.email);
        this.authenticated.emit(true);
        this.userEmail.emit(sessionResponse.email);
      })
    );
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(LocalStorageItem.ACCESS_TOKEN) != null;
  }

  getRefreshToken(): string {
    return localStorage.getItem(LocalStorageItem.REFRESH_TOKEN);
  }

  getAccessToken(): string {
    return localStorage.getItem(LocalStorageItem.ACCESS_TOKEN);
  }

  getUserEmail(): string {
    return localStorage.getItem(LocalStorageItem.USER_EMAIL);
  }

  deleteSession(): void {
    this.http.delete<void>(SESSIONS_URL, {
      headers: new HttpHeaders()
        .set(Header.X_API_KEY, this.getRefreshToken()),
    }).subscribe();

    this.clearData();
  }

  clearData(): void {
    localStorage.clear();

    this.authenticated.emit(false);
    this.userEmail.emit('');
  }
}
