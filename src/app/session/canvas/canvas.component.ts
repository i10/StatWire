import { Component, Input, OnInit } from '@angular/core';
import { Statlet } from '../../model/statlet';

@Component({
  selector: 'sl-canvas',
  templateUrl: './canvas.component.html',
})
export class CanvasComponent implements OnInit {
  @Input() activeStatlet: Statlet;

  constructor() { }

  ngOnInit() {
  }

}
