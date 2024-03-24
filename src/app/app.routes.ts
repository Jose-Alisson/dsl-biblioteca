import { Routes } from '@angular/router';
import { DashComponent } from './pages/dash/dash.component';
import { MenuComponent } from './pages/menu/menu.component';
import { EmprestimoComponent } from './pages/emprestimo/emprestimo.component';
import { AlunosComponent } from './pages/alunos/alunos.component';
import { AccountComponent } from './pages/account/account.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'd' },
  {
    path: 'd',
    component: DashComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'menu' },
      { path: 'menu', component: MenuComponent },
      { path: 'emprest', component: EmprestimoComponent },
      { path: 'aluno', component: AlunosComponent }
    ],
  },
  {
    path: 'a',
    component: AccountComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', component: LoginComponent }
    ]
  }
];
