import { Injectable, inject } from '@angular/core';
import { DSL_API_URL } from '../API_URL';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private URL = `${DSL_API_URL}/aluno`

  private http = inject(HttpClient)

  constructor() { }

  create(aluno: any){
    return this.http.post<any>(`${this.URL}/create`, aluno)
  }

  update(matricula: string, aluno: any){
    return this.http.put<any>(`${this.URL}/${matricula}/update`, aluno)
  }

  delete(matricula: string){
    return this.http.delete<any>(`${this.URL}/${matricula}/delete`)
  }

  getAlunos(){
    return this.http.get<any[]>(`${this.URL}/`)
  }
}
