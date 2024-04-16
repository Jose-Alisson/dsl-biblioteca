import { AsyncPipe, CommonModule, CurrencyPipe, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, RouterLink } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, distinct, map, mergeMap } from 'rxjs/operators';
import { LivroService } from '../../shared/services/livro/livro.service';
import { ModalComponent } from '../../shared/comps/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isEntered } from '../dash/dash.component';
import { SideBarComponent } from '../../shared/comps/side-bar/side-bar.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { InputFormComponent } from '../../shared/comps/form/input-form/input-form.component';
import { ValidateComponent } from '../../shared/comps/form/validate/validate.component';
import { DropdownComponent } from '../../shared/comps/dropdown/dropdown.component';
import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { TextAreaFormComponent } from '../../shared/comps/form/text-area-form/text-area-form.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CurrencyPipe,
    RouterLink, AsyncPipe,
    ModalComponent, ReactiveFormsModule,
    NgTemplateOutlet, DropdownComponent,
    SideBarComponent, InputFormComponent,
    ValidateComponent, CommonModule,
    FilterPipe, TextAreaFormComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {

  @ViewChild("modal")
  public modal?: ModalComponent

  @ViewChild("modalEdt")
  public modalEdt?: ModalComponent

  public searchResult = ""

  private end = inject(ActivatedRoute);
  private livrosService = inject(LivroService)
  private form = inject(FormBuilder)

  public livros$: Observable<any[]> = of()
  public livroE: any

  @ViewChild("formulario")
  public formularioTpt?: TemplateRef<any>

  private toast = inject(ToastrService)

  public filter = 'genero'

  public livroForm = this.form.group({
    autor: ["", [Validators.required]],
    titulo: ["", [Validators.required]],
    volume: ["", [Validators.required]],
    editora: ["", [Validators.required]],
    genero: ["", [Validators.required]],
    codigo: ["", [Validators.required]],
    quantidade: ["", [Validators.required]],
    observacao: ["", []]
  })

  public viewAllErrorForm = false

  ngOnInit(): void {
    this.end.queryParamMap.subscribe(params => {
      this.searchResult = (params.get('s') ?? '')
    })

    this.livros$ = this.livrosService.getLivros()
  }

  cadastrarLivro() {
    console.log(this.livroForm)
    console.log(this.livroForm.valid)

    if (this.livroForm.valid) {
      this.livrosService.createLivro(this.livroForm.value).subscribe({
        next: (data) => {

          console.log("Esta rodando sempre")
          this.livros$.subscribe(livros => {
            this.livros$ = new Observable(obs => {
              obs.next([...livros])
            })
          })

          this.modal?.setActive(false)
          this.limparForm()
        }, error: (err: HttpErrorResponse) => {
          this.toast.error('Ocorreu um erro', 'Error')

          console.log(err.error.codigo)

          if (err.error.codigo) {
            this.livroForm.controls.codigo.setErrors({ codigoEquals: true })
          }

          console.log(this.livroForm)

        }
      })
    } else {
      this.viewAllErrorForm = true
    }
  }

  setValuesModal() {
    this.livroForm.setValue({
      titulo: this.livroE.titulo,
      genero: this.livroE.genero,
      codigo: this.livroE.codigo,
      autor: this.livroE.autor,
      volume: this.livroE.volume,
      editora: this.livroE.editora,
      observacao: this.livroE.observacao,
      quantidade: this.livroE.quantidade
    })
  }

  limparForm() {
    this.livroForm = this.form.group({
      autor: ["", [Validators.required]],
      titulo: ["", [Validators.required]],
      volume: ["", [Validators.required]],
      editora: ["", [Validators.required]],
      genero: ["", [Validators.required]],
      codigo: ["", [Validators.required]],
      quantidade: ["", [Validators.required]],
      observacao: ["", []]
    })

    this.viewAllErrorForm = false
  }

  editarLivro(codigo: string) {
    console.log(this.livroForm)
    console.log(this.livroForm.valid)

    if (this.livroForm.valid) {
      this.livrosService.updateLivro(codigo, this.livroForm.value).subscribe({
        next: (data) => {
          this.livroE = data

          this.livros$.subscribe(livros => {

            let index = livros.findIndex(livro => livro.codigo === codigo)

            if (index != -1) {
              livros[index] = data
            }

            this.livros$ = new Observable(obs => {
              obs.next(livros)
            })

            this.modalEdt?.setActive(false)
            this.limparForm()
          })
        }, error: (err: HttpErrorResponse) => {
          console.log(err.error.codigo)

          if (err.error.codigo) {
            this.livroForm.controls.codigo.setErrors({ codigoEquals: true })
          }
        }
      })
    } else {
      this.viewAllErrorForm = true
    }
  }

  deletarLivro(codigo: string) {
    this.livrosService.delete(codigo).subscribe({
      next: () => {
        this.livros$.subscribe(data => {
          this.livros$ = new Observable(obs => {
            obs.next(data.filter(livro => livro.codigo != codigo))
          })
        })
        this.livroE = undefined
      }
    })
  }

  isEntered(controlName: string) {
    return (isEntered(this.livroForm, controlName) || this.viewAllErrorForm)
  }

  getRandomColor() {
    let r = Math.floor(Math.random() * 255)
    let g = Math.floor(Math.random() * 255)
    let b = Math.floor(Math.random() * 255)

    return `rgb(${r}, ${g}, ${b})`
  }
}
