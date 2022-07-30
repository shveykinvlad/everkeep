import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { GlobalInterceptor } from './global.interceptor';

describe('GlobalInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      MatSnackBarModule
    ],
    providers: [
      GlobalInterceptor,
    ],
  }));

  it('should be created', () => {
    const interceptor: GlobalInterceptor = TestBed.inject(GlobalInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
