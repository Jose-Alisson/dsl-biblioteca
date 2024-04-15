import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { AlunoService } from '../../shared/services/aluno/aluno.service';
import { DropdownComponent } from '../../shared/comps/dropdown/dropdown.component';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ModalComponent } from '../../shared/comps/modal/modal.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { isEntered } from '../dash/dash.component';
import { SideBarComponent } from '../../shared/comps/side-bar/side-bar.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [DropdownComponent, AsyncPipe, ModalComponent, ReactiveFormsModule, NgTemplateOutlet, SideBarComponent],
  templateUrl: './alunos.component.html',
  styleUrl: './alunos.component.scss'
})
export class AlunosComponent implements OnInit {

  @ViewChild("formTpt")
  public formTpt?: TemplateRef<any>

  @ViewChild("modalCreate")
  public modalCreate?: ModalComponent

  @ViewChild("modalEdit")
  public modalEdit?: ModalComponent

  public turmas$: Observable<any[]> = of()
  public turmas_: any

  private alunoService = inject(AlunoService)

  public aluno_: any

  private form = inject(FormBuilder)
  public alunoForm = this.form.group({
    nome: ["", [Validators.required]],
    matricula: ["", [Validators.required]],
    turma: ["", [Validators.required]],
    turno: ["", [Validators.required]]
  })

  public viewAllErrorForm = false

  ngOnInit(): void {

    this.alunoService.getAlunos().subscribe(data => {
      this.turmas_ = data
      this.turmas$ = of(Object.keys(data).sort((a, b) => this.ordernar(a, b)))
    })
  }

  getAlunosByTurma(turma: string) {
    return this.turmas_?.[turma]
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

  setValues() {
    this.alunoForm.setValue({
      nome: this.aluno_.nome,
      matricula: this.aluno_.matricula,
      turma: this.aluno_.turma,
      turno: this.aluno_.turno
    })
  }

  limparForm() {
    this.alunoForm = this.form.group({
      nome: ["", [Validators.required]],
      matricula: ["", [Validators.required]],
      turma: ["", [Validators.required]],
      turno: ["", [Validators.required]]
    })

    this.viewAllErrorForm = false
  }

  create() {
    if (this.alunoForm.valid) {
      this.alunoService.create(this.alunoForm.value).subscribe({next:(data) => {
        this.alunoService.getAlunos().subscribe(data => {
          this.turmas_ = data
          this.turmas$ = of(Object.keys(data).sort((a, b) => this.ordernar(a, b)))

          this.modalCreate?.setActive(false)
          this.limparForm()
        })
      }, error: (err: HttpErrorResponse) => {
        if(err.error.matricula){
          this.alunoForm.controls.matricula.setErrors({matriculaEquals: true})
        }
      }})
    } else {
      this.viewAllErrorForm = true
    }
  }

  edit() {
    if (this.alunoForm.valid) {
      this.alunoService.update(this.aluno_.matricula, this.alunoForm.value).subscribe({next:(data) => {
        this.aluno_ = data

        this.alunoService.getAlunos().subscribe(data => {
          this.turmas_ = data
          this.turmas$ = of(Object.keys(data).sort((a, b) => this.ordernar(a, b)))
        })

        this.modalEdit?.setActive(false)
        this.limparForm()
      }, error: (err: HttpErrorResponse) => {

        if(err.error.matricula){
          this.alunoForm.controls.matricula.setErrors({matriculaEquals: true})
        }
        
      }})
    } else {
      this.viewAllErrorForm = true
    }
  }

  delete() {
    this.alunoService.delete(this.aluno_.matricula).subscribe(data => {
      this.aluno_ = undefined

      this.alunoService.getAlunos().subscribe(data => {
        this.turmas_ = data
        this.turmas$ = of(Object.keys(data).sort((a, b) => this.ordernar(a, b)))
      })
    })
  }

  isEntered(controlName: string){
    return (isEntered(this.alunoForm, controlName) || this.viewAllErrorForm)
  }
}
