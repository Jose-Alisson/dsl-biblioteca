import { Component, OnInit, input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { isEntered } from '../../../../pages/dash/dash.component';

@Component({
  selector: 'app-validate',
  standalone: true,
  imports: [],
  templateUrl: './validate.component.html',
  styleUrl: './validate.component.scss'
})
export class ValidateComponent implements OnInit {

  viewAllError = input(false)
  control = input.required<FormControl<any>>()
  validatorName = input('')
  message = input('')
  
  isEntered() {
    return ((this.control()?.touched || this.control()?.dirty) || this.viewAllError())
  } 
  
  ngOnInit(): void {
  }
}
