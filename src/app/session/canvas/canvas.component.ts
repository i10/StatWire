import { AfterViewInit, Component, HostBinding, HostListener } from '@angular/core';

import { CanvasPosition } from '../../model/canvas-position';
import { StatletManagerService } from '../../model/statlet-manager.service';
import { PlumbingService } from './plumbing.service';

@Component({
  selector: 'sl-canvas',
  templateUrl: './canvas.component.html',
  providers: [PlumbingService],
})
export class CanvasComponent implements AfterViewInit {
  @HostBinding('id') htmlId = 'sl-canvas';

  @HostListener('click', ['$event']) onLeftClick($event: MouseEvent): void {
    $event.preventDefault();
    if (!this.isTopmostTarget($event)) {
      return;
    }
    const [posX, posY] = [$event.pageX, $event.pageY];
    this.statletManager.createGroup(new CanvasPosition(posX, posY));
  }

  @HostListener('contextmenu', ['$event']) onRightClick($event: MouseEvent): void {
    $event.preventDefault();
    if (!this.isTopmostTarget($event)) {
      return;
    }
    const [posX, posY] = [$event.pageX, $event.pageY];
    this.statletManager.createStatlet(new CanvasPosition(posX, posY));
  }

  private isTopmostTarget(event: Event): boolean {
    return event.target === event.currentTarget;
  }

  constructor(
    private plumbing: PlumbingService,
    public statletManager: StatletManagerService,
  ) { }

  ngAfterViewInit() {
    this.initializePlumbing();
  }

  private initializePlumbing(): void {
    this.plumbing.setContainer(this.htmlId);
  }
}
