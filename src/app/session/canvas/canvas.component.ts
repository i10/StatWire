import { AfterViewInit, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import { Statlet } from '../../model/statlet';
import { PlumbingService } from './plumbing.service';

@Component({
  selector: 'sl-canvas',
  templateUrl: './canvas.component.html',
  providers: [PlumbingService],
})
export class CanvasComponent implements AfterViewInit {
  @Input() activeStatlet: Statlet;
  @Input() allStatlets: Statlet[];
  @Output() onActiveStatletChanged: EventEmitter<Statlet> = new EventEmitter();

  @HostBinding('id') htmlId = 'sl-canvas';

  constructor(
    private plumbing: PlumbingService,
  ) { }

  ngAfterViewInit() {
    this.initializePlumbing();
  }

  private initializePlumbing(): void {
    this.plumbing.setContainer(this.htmlId);
  }

  changeActiveStatlet(selectedStatlet: Statlet): void {
    this.onActiveStatletChanged.emit(selectedStatlet);
  }
}
