import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { Statlet } from '../../model/statlet';
import { StatletManagerService } from '../../model/statlet-manager.service';
import { PlumbingService } from './plumbing.service';

@Component({
  selector: 'sl-canvas',
  templateUrl: './canvas.component.html',
  providers: [PlumbingService],
})
export class CanvasComponent implements OnInit {
  @Input() activeStatlet: Statlet;
  statlets: Statlet[];

  constructor(
    private statletManager: StatletManagerService,
    private plumbing: PlumbingService,
    private element: ElementRef,
  ) { }

  ngOnInit() {
    this.statlets = this.statletManager.getAllStatlets();
    this.initializePlumbing();
  }

  private initializePlumbing(): void {
    this.plumbing.setContainer(this.element);
  }

}
