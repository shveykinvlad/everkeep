import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SessionResponse } from '../models/session-response';
import { NotificationService } from '../services/notification.service';
import { SessionService } from '../services/session.service';

const SESSION_ERROR_MESSAGE: string = 'Full authentication is required to access this resource';
const VERIFICATION_TOKEN_ERROR_MESSAGE: string = 'Verification token is expired';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

  constructor(
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.sessionService.getAccessToken()) {
      request = this.getAuthorizedRequest(request, this.sessionService.getAccessToken());
    }

    return next.handle(request).pipe(
      catchError(error => this.handleError(request, error, next))
    );
  }

  private getAuthorizedRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handleError(request: HttpRequest<any>, error: any, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isHttpError(error)) {
      return this.handleHttpError(request, error, next);
    }
    return throwError(error);
  }

  private isHttpError(error: Error): boolean {
    return error instanceof HttpErrorResponse;
  }

  private handleHttpError(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isSessionError(error)) {
      return this.handleSessionError(request, next);
    } else {
      this.notificationService.showError(error.error.message);
    }
    return throwError(error);
  }

  private isSessionError(error: HttpErrorResponse): boolean {
    return error.status === HttpStatusCode.Unauthorized
      && SESSION_ERROR_MESSAGE === error.error.message;
  }

  private handleSessionError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.getToken(request, next);
  }

  private getToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.sessionService.update().pipe(
      switchMap((sessionResponse: SessionResponse) => {
        return next.handle(this.getAuthorizedRequest(request, sessionResponse.jwt));
      }),
      catchError(error => this.handleRefreshSessionError(request, error, next))
    );
  }

  private handleRefreshSessionError(request: HttpRequest<any>, error: HttpErrorResponse, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isVerificationTokenExpiredError(error)) {
      this.handleVerificationTokenExpiredError();
    }
    return throwError(error);
  }

  private isVerificationTokenExpiredError(error: HttpErrorResponse): boolean {
    return this.isHttpError(error)
      && error.status === HttpStatusCode.BadRequest
      && VERIFICATION_TOKEN_ERROR_MESSAGE === error.error.message;
  }

  private handleVerificationTokenExpiredError(): void {
    this.sessionService.clearData();
    this.router.navigateByUrl('/users/login');
  }
}
