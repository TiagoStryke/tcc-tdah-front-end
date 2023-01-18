import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import HttpStatusCode from '../models/http-status-code';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastrService: ToastrService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> | any {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === HttpStatusCode.NO_CONTENT) {
            this.toastrService.warning(
              'Nenhum registro localizado.',
              'Atenção'
            );
            return null;
          }
        }

        return event;
      }),
      catchError((err: HttpErrorResponse) => {
        const { error } = err;
        if (error.status) {
          if (this.isServerError(error))
            this.toastrService.warning(error.message, 'Atenção');
          else this.toastrService.warning(error.message, 'Atenção');
        } else {
          this.toastrService.error(
            'Erro ao se conectar com o servidor.',
            'Atenção'
          );
        }

        return throwError(() => new Error(err.message));
      })
    );
  }

  private isServerError(error: HttpErrorResponse): boolean {
    return error.status === HttpStatusCode.INTERNAL_SERVER_ERROR;
  }
}
