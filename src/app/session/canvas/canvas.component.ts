import { AfterViewInit, Component, HostBinding, HostListener } from '@angular/core';

import { CanvasPosition } from '../../model/canvas-position';
import { Statlet } from '../../model/statlet';
import { StatletManagerService } from '../../model/statlet-manager.service';
import { PlumbingService } from './plumbing.service';

@Component({
  selector: 'sl-canvas',
  templateUrl: './canvas.component.html',
  providers: [PlumbingService],
})
export class CanvasComponent implements AfterViewInit {
  @HostBinding('id') htmlId = 'sl-canvas';

  @HostListener('contextmenu', ['$event']) onRightClick($event: MouseEvent): void {
    $event.preventDefault();
    const [posX, posY] = [$event.pageX, $event.pageY];
    this.statletManager.createStatlet(new CanvasPosition(posX, posY));
  }

  @HostListener('dblclick', ['$event']) onDoubleClick($event: MouseEvent): void {
    $event.preventDefault();
    const [posX, posY] = [$event.pageX, $event.pageY];
    this.statletManager.showNodePool(new CanvasPosition(posX, posY));
  }

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
  ) { }

  get allStatlets(): Statlet[] {
    return this.statletManager.allStatlets;
  }

  ngAfterViewInit() {
    this.initializePlumbing();
  }

  private initializePlumbing(): void {
    this.plumbing.setContainer(this.htmlId);
  }
}
