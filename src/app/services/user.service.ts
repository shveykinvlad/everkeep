import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RegistrationRequest } from '../models/registration-request';
import { Observable } from 'rxjs';
import { ApiUrl } from '../constants/api-url';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() authenticated: EventEmitter<boolean> = new EventEmitter();
  @Output() userEmail: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient) { }

  register(requestPayload: RegistrationRequest): Observable<void> {
    return this.http.post<void>(ApiUrl.register, requestPayload);
  }

  confirm(token: string): Observable<void> {
    return this.http.get<void>(ApiUrl.confirm, {
      params: new HttpParams()
        .set('token', token)
    });
  }

  resendToken(email: string): Observable<void> {
    return this.http.get<void>(ApiUrl.resendToken, {
      params: new HttpParams()
        .set('email', email)
    });
  }

  authenticate(requestPayload: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(ApiUrl.login, requestPayload).pipe(
      tap(authResponse => {
        localStorage.setItem('accessToken', authResponse.jwt);
        localStorage.setItem('refreshToken', authResponse.refreshTokenValue);
        localStorage.setItem('userEmail', authResponse.userEmail);
        this.authenticated.emit(true);
        this.userEmail.emit(authResponse.userEmail);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(ApiUrl.refreshAccessToken, this.getRefreshToken()).pipe(
      tap(authResponse => {
        localStorage.setItem('accessToken', authResponse.jwt);
        localStorage.setItem('refreshToken', authResponse.refreshTokenValue);
        localStorage.setItem('userEmail', authResponse.userEmail);
        this.authenticated.emit(true);
        this.userEmail.emit(authResponse.userEmail);
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

  resetPassword(email: string): Observable<void> {
    return this.http.get<void>(ApiUrl.resetPassword, {
      params: new HttpParams()
        .set('email', email)
    });
  }

  updatePassword(requestPayload: RegistrationRequest, token: string): Observable<void> {
    return this.http.put<void>(ApiUrl.updatePassword, requestPayload, {
      params: new HttpParams()
        .set('token', token)
    });
  }
}
