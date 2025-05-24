import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let message = 'Сталася невідома помилка';

      if (err.status === 0) {
        message = 'Відсутнє підключення до сервера';
      } else if (typeof err.error === 'string') {
        message = err.error;
      } else if (err.error?.error) {
        message = err.error.error;
      }

      toast.show(message);
      return throwError(() => err);
    })
  );
};
