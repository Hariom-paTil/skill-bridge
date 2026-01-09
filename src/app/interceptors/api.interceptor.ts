import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Redirect localhost:7152 requests to /api proxy
    if (req.url.includes('localhost:7152')) {
      const newUrl = req.url.replace('https://localhost:7152/api', '/api');
      req = req.clone({ url: newUrl });
    }
    return next.handle(req);
  }
}
