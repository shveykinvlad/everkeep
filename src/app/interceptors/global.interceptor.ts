import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SessionResponse } from '../models/session-response';
import { UserService } from '../services/user.service';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

  constructor(private userService: UserService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.userService.getAccessToken()) {
      request = this.getAuthorizedRequest(request, this.userService.getAccessToken());
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
    if (this.isUnauthorizedError(error)) {
      return this.handleUnauthorizedError(request, next);
    }
    return throwError(error);
  }

  private isUnauthorizedError(error: HttpErrorResponse): boolean {
    return error.status === HttpStatusCode.Unauthorized;
  }

  private isBadRequestError(error: HttpErrorResponse): boolean {
    return error.status === HttpStatusCode.BadRequest;
  }

  private handleVerificationTokenExpiredError(): void {
    this.userService.clearData();
    this.router.navigateByUrl('/users/login');
  }

  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.getToken(request, next);
  }

  private getToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.userService.refreshSession().pipe(
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
    return this.isHttpError(error) && this.isBadRequestError(error) && error.error.message === 'Verification token is expired';
  }
}
