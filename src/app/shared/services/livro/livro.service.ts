import { Injectable, inject } from '@angular/core';
import { DSL_API_URL } from '../API_URL';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LivroService {

  private URL = `${DSL_API_URL}/livro`

  private http = inject(HttpClient)

  constructor() { }

  createLivro(livro: any){
    return this.http.post<any>(`${this.URL}/create`, livro)
  }

  updateLivro(codigo: string, livro: any) {
    return this.http.put<any>(`${this.URL}/${codigo}/update`, livro)
  }

  delete(codigo: string){
    return this.http.delete<any>(`${this.URL}/${codigo}/delete`)
  }

  getLivros() {
    return this.http.get<any[]>(`${this.URL}/`)
  }
}
