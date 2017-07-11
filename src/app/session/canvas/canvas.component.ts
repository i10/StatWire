import { AfterViewInit, Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

import { Statlet } from '../../model/statlet';
import { PlumbingService } from './plumbing.service';
import { StatletManagerService } from '../../model/statlet-manager.service';
import { CanvasPosition } from '../../model/canvas-position';

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

  @HostListener('contextmenu', ['$event']) onRightClick($event: MouseEvent): void {
    $event.preventDefault();
    const [posX, posY] = [$event.pageX, $event.pageY];
    this.statletManager.createStatlet('New StatLet', new CanvasPosition(posX, posY))
  }

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
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
