import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  @Input()
  public title = ""

  @Input()
  public active = false

  toogleActive(){
    this.active = !this.active
  }

  setActive(active: boolean){
    this.active = active
  }
}
