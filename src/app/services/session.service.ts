import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LocalStorageItem } from '../constants/local-storage-items';
import { SessionRequest } from '../models/session-request';
import { SessionResponse } from '../models/session-response';

const SESSIONS_URL: string = `${environment.apiUrl}/sessions`;
const TOKEN_PARAM: string = 'token';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  @Output() authenticated: EventEmitter<boolean> = new EventEmitter();
  @Output() userEmail: EventEmitter<string> = new EventEmitter();

  constructor(
    private http: HttpClient
  ) { }

  create(payload: SessionRequest): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(SESSIONS_URL, payload).pipe(
      tap(sessionResponse => {
        this.saveSession(sessionResponse);
        this.authenticated.emit(true);
        this.userEmail.emit(sessionResponse.email);
      })
    );
  }

  update(): Observable<SessionResponse> {
    return this.http.put<SessionResponse>(SESSIONS_URL, null, {
      params: new HttpParams()
        .set(TOKEN_PARAM, this.getRefreshToken()),
    }).pipe(
      tap(sessionResponse => {
        this.saveSession(sessionResponse);
        this.authenticated.emit(true);
        this.userEmail.emit(sessionResponse.email);
      })
    );
  }

  delete(): void {
    this.http.delete<void>(SESSIONS_URL, {
      params: new HttpParams()
        .set(TOKEN_PARAM, this.getRefreshToken()),
    }).subscribe();

    this.clearData();
  }

  clearData(): void {
    localStorage.clear();

    this.authenticated.emit(false);
    this.userEmail.emit(null);
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

  private saveSession(response: SessionResponse): void {
    localStorage.setItem(LocalStorageItem.ACCESS_TOKEN, response.authToken);
    localStorage.setItem(LocalStorageItem.REFRESH_TOKEN, response.refreshToken);
    localStorage.setItem(LocalStorageItem.USER_EMAIL, response.email);
  }
}
