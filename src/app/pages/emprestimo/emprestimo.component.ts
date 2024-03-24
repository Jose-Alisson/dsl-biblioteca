import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { Observable, concat, concatAll, distinct, distinctUntilChanged, filter, map, mergeAll, of, tap } from 'rxjs';
import { EmprestService } from '../../shared/services/emprest/emprest.service';
import { AsyncPipe, CommonModule, DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ModalComponent } from '../../shared/comps/modal/modal.component';
import { DropdownComponent } from '../../shared/comps/dropdown/dropdown.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-emprestimo',
  standalone: true,
  imports: [AsyncPipe, DatePipe, CommonModule, ModalComponent, DropdownComponent, NgTemplateOutlet, ReactiveFormsModule],
  templateUrl: './emprestimo.component.html',
  styleUrl: './emprestimo.component.scss'
})
export class EmprestimoComponent implements OnInit {

  private emprestService = inject(EmprestService)

  public turmas: any[] = []
  public emprestEscolhi: any
  public estructuct: any

  @ViewChild("tptEmprest")
  public tptEmprest?: TemplateRef<any>

  @ViewChild("modalCreate")
  public modalCreate?: ModalComponent

  @ViewChild("modalEdit")
  public modalEdit?: ModalComponent

  public form = inject(FormBuilder)

  public emprestForm = this.form.group({
    titulo: ["", [Validators.required]],
    matricula: ["", [Validators.required]],
    livros: ["", []],
    dataDevolucao: ["", [Validators.required]]
  })

  ngOnInit(): void {
    this.emprestService.getEmprestimoOrdenado().subscribe(data => {
      this.estructuct = data
      this.turmas = Object.keys(data).sort((a, b) => this.ordernar(a, b))
    })
  }

  getTurmas() {
    return this.turmas;
  }

  deleteEmprest() {
    this.emprestService.deleteEmprestimo(this.emprestEscolhi.id).subscribe({
      next: () => {
        this.emprestEscolhi = undefined

        this.emprestService.getEmprestimoOrdenado().subscribe(data => {
          this.estructuct = data
          this.turmas = Object.keys(data).sort((a, b) => this.ordernar(a, b))
        })
      }
    })
  }

  private ordernar(turmaA: string, turmaB: string) {
    let numA = parseInt((turmaA.match(/\d+/) ?? '')[0])
    let numB = parseInt((turmaB.match(/\d+/) ?? '')[0])

    if (numA !== numB) {
      return numA - numB
    }

    let letraA = (turmaA.match(/[a-zA-Z]+/) ?? '')[0]
    let letraB = (turmaB.match(/[a-zA-Z]+/) ?? '')[0]

    return letraA.localeCompare(letraB)
  }

  public alunosByTurma(turma: string) {
    return Object.keys(this.estructuct[turma]);
  }

  getEmprestimoByAluno(turma: string, aluno: string) {
    return of(this.estructuct[turma][aluno])
  }

  statusEmprestimo(emprestimo: any) {
    let dataDevolucao = new Date(emprestimo.dataDevolucao)
    let dataAtual = new Date()

    if (dataAtual.getTime() > dataDevolucao.getTime()) {
      return { 'atrasado': true }
    } else {
      return { 'atrasado': false }
    }
  }

  create() {
    if (this.emprestForm.valid) {
      let livros = Array.of<{ codigo: string }>()

      this.emprestForm.controls.livros.value?.split(',').forEach(livro => {
        livros.push({ codigo: livro })
      })

      let emprest = {
        titulo: this.emprestForm.controls.titulo.value,
        aluno: {
          matricula: this.emprestForm.controls.matricula.value
        },
        livros: livros,
        dataDevolucao: this.emprestForm.controls.dataDevolucao.value
      }

      this.emprestService.create(emprest).subscribe({
        next: (data) => {
          this.emprestService.getEmprestimoOrdenado().subscribe(data => {
            this.estructuct = data
            this.turmas = Object.keys(data).sort((a, b) => this.ordernar(a, b))
          })

          this.modalCreate?.setActive(false)
          this.limparForm()
        }
      })
    }
  }

  setValues() {
    this.emprestForm.setValue({
      titulo: this.emprestEscolhi.titulo,
      matricula: this.emprestEscolhi.aluno.matricula,
      livros: "" + this.emprestEscolhi.livros.map((livro: any) => livro.codigo),
      dataDevolucao: this.emprestEscolhi.dataDevolucao
    })
  }

  limparForm() {
    this.emprestForm.setValue({
      titulo: "",
      matricula: "",
      livros: "",
      dataDevolucao: ""
    })
  }

  editar() {
    if (this.emprestForm.valid) {
      let livros = Array.of<{ codigo: string }>()

      this.emprestForm.controls.livros.value?.split(',').forEach(livro => {
        livros.push({ codigo: livro })
      })

      console.log(this.emprestForm.controls.livros.value)

      console.log(livros)

      let emprest = {
        id: this.emprestEscolhi.id,
        titulo: this.emprestForm.controls.titulo.value,
        aluno: {
          matricula: this.emprestForm.controls.matricula.value
        },
        livros: livros,
        dataDevolucao: this.emprestForm.controls.dataDevolucao.value
      }

      this.emprestService.update(this.emprestEscolhi.id, emprest).subscribe({
        next: (data) => {
          this.emprestEscolhi = data

          this.emprestService.getEmprestimoOrdenado().subscribe(data => {
            this.estructuct = data
            this.turmas = Object.keys(data).sort((a, b) => this.ordernar(a, b))
          })

          this.modalEdit?.setActive(false)
          this.limparForm()
        }
      })
    }
  }
}

