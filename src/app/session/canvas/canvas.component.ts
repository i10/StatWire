import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

import { Statlet } from '../../model/statlet';
import { StatletManagerService } from '../../model/statlet-manager.service';
import { PlumbingService } from './plumbing.service';

@Component({
  selector: 'sl-canvas',
  templateUrl: './canvas.component.html',
  providers: [PlumbingService],
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @Input() activeStatlet: Statlet;
  statlets: Statlet[];
  @HostBinding('id') htmlId = 'sl-canvas';

  constructor(
    private statletManager: StatletManagerService,
    private plumbing: PlumbingService,
  ) { }

  ngOnInit() {
    this.statlets = this.statletManager.getAllStatlets();
  }

  ngAfterViewInit() {
    this.initializePlumbing();
  }

  private initializePlumbing(): void {
    this.plumbing.setContainer(this.htmlId);
  }

  setActiveStatlet(selectedStatlet: Statlet): void {
    this.activeStatlet = selectedStatlet;
  }
}
