import { Component, ViewChild } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [SideBarComponent, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  @ViewChild('side')
  public side?: SideBarComponent

}
