import { Component, ContentChildren, QueryList, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ValidateComponent } from '../validate/validate.component';

@Component({
  selector: 'app-text-area-form',
  standalone: true,
  imports: [ReactiveFormsModule, ValidateComponent],
  templateUrl: './text-area-form.component.html',
  styleUrl: './text-area-form.component.scss'
})
export class TextAreaFormComponent {
  @ContentChildren(ValidateComponent)
  validators: QueryList<ValidateComponent> | undefined;

  viewAllError = input(false)
  control = input.required<FormControl<any>>()
  required = input<boolean>()

  title = input('', {
    transform: (valor: string | null) => (valor || '')
  })
}
