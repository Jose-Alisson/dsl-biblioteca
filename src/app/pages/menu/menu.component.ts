import { AsyncPipe, CurrencyPipe, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, RouterLink } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { LivroService } from '../../shared/services/livro/livro.service';
import { ModalComponent } from '../../shared/comps/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isEntered } from '../dash/dash.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, AsyncPipe, ModalComponent, ReactiveFormsModule, NgTemplateOutlet],
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

  public livroForm = this.form.group({
    titulo: ["", [Validators.required]],
    genero: ["", [Validators.required]],
    codigo: ["", [Validators.required]]
  })

  private viewAllErrorForm = false

  ngOnInit(): void {
    this.end.queryParamMap.subscribe(params => {
      this.searchResult = (params.get('s') ?? '')
    })

    this.livros$ = this.livrosService.getLivros()
  }

  cadastrarLivro() {
    if (this.livroForm.valid) {
      this.livrosService.createLivro(this.livroForm.value).subscribe(data => {

        console.log("Esta rodando sempre")
        // this.livros$.subscribe(livros => {
        //   this.livros$ = new Observable(obs => {
        //     obs.next([...livros, data])
        //   })
        // })

        this.modal?.setActive(false)
        this.limparForm()
      })
    } else {
      this.viewAllErrorForm = true
    }
  }

  setValuesModal() {
    this.livroForm.setValue({
      titulo: this.livroE.titulo,
      genero: this.livroE.genero,
      codigo: this.livroE.codigo
    })
  }

  limparForm() {
    this.livroForm.setValue({
      titulo: "",
      genero: "",
      codigo: ""
    })
  }

  editarLivro(codigo: string) {
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
}
