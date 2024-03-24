import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {

  @Input()
  title: string = ''

  toggleWrapper(element: HTMLDivElement) {
    element.classList.toggle("active")
  }
}
