import { CurrencyPipe, ViewportScroller, AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CurrencyPipe, AsyncPipe, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit ,AfterViewInit {

  destaque$: Observable<any[]> = of([])

  private vs = inject(ViewportScroller);

  constructor(){}

  ngOnInit(): void {
      //this.destaque$ = this.ps.getByOffSet("467ef5a8-a298-416c-afb7-d3d6e0a02f7d", 0)
  }

  ngAfterViewInit(): void {}

  scrollToElement(id: string) {
    let comp = document.getElementById(`${id}`);

    if (comp) {
      let y = comp.getBoundingClientRect().y;
      this.vs.scrollToPosition([0, !!y ? y - 85 : 0]);
      return;
    }

    this.vs.scrollToPosition([0, 0]);
  }
}
