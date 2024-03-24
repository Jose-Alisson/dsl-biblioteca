import { Component } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-cep',
  standalone: true,
  imports: [NgxMaskPipe, NgxMaskDirective],
  templateUrl: './cep.component.html',
  styleUrl: './cep.component.scss'
})
export class CepComponent {

}
