import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { SessionResponse } from '../models/session-response';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

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
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.getToken(request, next);
    } else {
      return this.addToken(request, next);
    }
  }

  private addToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(jwt => {
        return next.handle(this.getAuthorizedRequest(request, jwt));
      })
    );
  }

  private getToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.userService.refreshSession().pipe(
      switchMap((sessionResponse: SessionResponse) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(sessionResponse.jwt);
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
