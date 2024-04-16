import { Component, ContentChildren, OnInit, QueryList, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ValidateComponent } from '../validate/validate.component';

@Component({
  selector: 'app-input',
  standalone: true,
  host: {

  },
  imports: [ReactiveFormsModule, ValidateComponent],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss'
})
export class InputFormComponent{


  @ContentChildren(ValidateComponent)
  validators: QueryList<ValidateComponent> | undefined;

  viewAllError = input(false)
  control = input.required<FormControl<any>>()
  required = input<boolean>()

  title = input('', {
    transform: (valor: string | null) => (valor || '')
  })

  type = input('')
}
