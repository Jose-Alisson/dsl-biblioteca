import { Inject, Injectable, inject } from '@angular/core';
import { DSL_API_URL } from '../API_URL';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private URL = `${DSL_API_URL}/account`

  private http = inject(HttpClient)

  private router = inject(Router)

  constructor(@Inject(DOCUMENT) private document: Document) { }

  login(user: string, senha: string) {
    let params = new HttpParams().append("user", user).append("password", senha)
    return this.http.post<any>(`${this.URL}/login`, null, { params: params }).pipe(tap(data => {
      this.document.defaultView?.localStorage?.setItem("token", data.access)
    }))
  }

  sair(){
    this.document.defaultView?.localStorage?.removeItem('token')
    this.router.navigate(['a'])
  }
}
