import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RegistrationRequest } from '../models/registration-request';
import { Observable } from 'rxjs';
import { ApiUrl } from '../constants/api-url';
import { SessionRequest } from '../models/session-request';
import { SessionResponse } from '../models/session-response';
import { tap } from 'rxjs/operators';
import { Header } from '../constants/header';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() authenticated: EventEmitter<boolean> = new EventEmitter();
  @Output() userEmail: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient) { }

  register(requestPayload: RegistrationRequest): Observable<void> {
    return this.http.post<void>(ApiUrl.users, requestPayload);
  }

  resendConfirmation(email: string): Observable<void> {
    return this.http.get<void>(ApiUrl.confirmation, {
      params: new HttpParams()
        .set('email', email)
    });
  }

  applyConfirmation(token: string): Observable<void> {
    return this.http.post<void>(ApiUrl.confirmation, null, {
      headers: new HttpHeaders()
        .set(Header.xApiKey, token),
    });
  }

  resetPassword(email: string): Observable<void> {
    return this.http.delete<void>(ApiUrl.password, {
      params: new HttpParams()
        .set('email', email)
    });
  }

  updatePassword(requestPayload: RegistrationRequest, token: string): Observable<void> {
    return this.http.post<void>(ApiUrl.password, requestPayload, {
      headers: new HttpHeaders()
        .set(Header.xApiKey, token),
    });
  }

  createSession(requestPayload: SessionRequest): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(ApiUrl.session, requestPayload).pipe(
      tap(sessionResponse => {
        localStorage.setItem('accessToken', sessionResponse.jwt);
        localStorage.setItem('refreshToken', sessionResponse.refreshToken);
        localStorage.setItem('userEmail', sessionResponse.email);
        this.authenticated.emit(true);
        this.userEmail.emit(sessionResponse.email);
      })
    );
  }

  refreshSession(): Observable<SessionResponse> {
    return this.http.put<SessionResponse>(ApiUrl.session, null, {
      headers: new HttpHeaders()
        .set(Header.xApiKey, this.getRefreshToken()),
    }).pipe(
      tap(sessionResponse => {
        localStorage.setItem('accessToken', sessionResponse.jwt);
        localStorage.setItem('refreshToken', sessionResponse.refreshToken);
        localStorage.setItem('userEmail', sessionResponse.email);
        this.authenticated.emit(true);
        this.userEmail.emit(sessionResponse.email);
      })
    );
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('accessToken') != null;
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken');
  }

  getAccessToken(): string {
    return localStorage.getItem('accessToken');
  }

  getUserEmail(): string {
    return localStorage.getItem('userEmail');
  }

  deleteSession(): void {
    this.http.delete<void>(ApiUrl.session, {
      headers: new HttpHeaders()
        .set(Header.xApiKey, this.getRefreshToken()),
    }).subscribe();

    this.clearData();
  }

  clearData(): void {
    localStorage.clear();

    this.authenticated.emit(false);
    this.userEmail.emit(null);
  }
}
