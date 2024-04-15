import { Component, inject } from '@angular/core';
import { AccountService } from '../../shared/services/account/account.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private router = inject(Router)
  private accountService = inject(AccountService)
  private form = inject(FormBuilder)

  public loginForm = this.form.group({
    user: ["", [Validators.required]],
    password: ["", [Validators.required]]
  })

  login(){
    if(this.loginForm.valid){
      let values = this.loginForm.value
      this.accountService.login(values.user ?? '', values.password ?? '').subscribe({next:(data) => {
        this.router.navigate(['/d/menu'])
      }, error: (err: HttpErrorResponse) => {
        if(err.status === 404){
          this.loginForm.get('user')?.setErrors({UserNotFound: true})
        }

        if(err.status === 401){
          this.loginForm.get('password')?.setErrors({passwordNotAuthorized: true})
        }
      }})
    }
  }
}
