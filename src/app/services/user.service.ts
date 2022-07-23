import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RegistrationRequest } from '../models/registration-request';
import { Observable } from 'rxjs';
import { ApiUrl } from '../constants/api-url';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';
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

  authenticate(requestPayload: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(ApiUrl.authentication, requestPayload).pipe(
      tap(authResponse => {
        localStorage.setItem('accessToken', authResponse.jwt);
        localStorage.setItem('refreshToken', authResponse.refreshToken);
        localStorage.setItem('userEmail', authResponse.email);
        this.authenticated.emit(true);
        this.userEmail.emit(authResponse.email);
      })
    );
  }

  refreshAccess(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(ApiUrl.refreshAccessToken, null, {
      headers: new HttpHeaders()
        .set(Header.xApiKey, this.getRefreshToken()),
    }).pipe(
      tap(authResponse => {
        localStorage.setItem('accessToken', authResponse.jwt);
        localStorage.setItem('refreshToken', authResponse.refreshToken);
        localStorage.setItem('userEmail', authResponse.email);
        this.authenticated.emit(true);
        this.userEmail.emit(authResponse.email);
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

  logout(): void {
    localStorage.clear();

    this.authenticated.emit(false);
    this.userEmail.emit(null);
  }
}
