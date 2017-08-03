import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sl-statlet-node',
  templateUrl: './statlet-node.component.html',
  styleUrls: ['./statlet-node.component.sass']
})
export class StatletNodeComponent implements OnInit {
  private name: string = "";

  constructor() { }

  ngOnInit() {
    this.name = "[Statlet]";
  }

}
