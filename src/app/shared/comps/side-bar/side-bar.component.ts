import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {

  @Input()
  public side = ''

  @Input()
  public active = false

  toogleActive(){
    this.active = !this.active
  }

  getSide(){
    return this.side
  }
}
