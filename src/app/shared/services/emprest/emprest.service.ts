import { Injectable, inject } from '@angular/core';
import { DSL_API_URL } from '../API_URL';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmprestService {

  private URL = `${DSL_API_URL}/emprestimo`

  private http = inject(HttpClient)

  constructor() { }

  create(emprest: any){
    return this.http.post<any>(`${this.URL}/create`, emprest)
  }

  update(id: number, emprest: any){
    return this.http.put<any>(`${this.URL}/${id}/update`, emprest)
  }

  getEmprestimos() {
    return this.http.get<any[]>(`${this.URL}/`)
  }

  deleteEmprestimo(id: number){
    return this.http.delete<any>(`${this.URL}/${id}/delete`)
  }

  getEmprestimoOrdenado(){
    return this.http.get<any>(`${this.URL}/ordenar`)
  }
}
