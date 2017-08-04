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
  private show: boolean = false;
  private canvasPosition: CanvasPosition = { x: 0, y: 0 };

  @HostBinding('id') htmlId = 'sl-canvas';

  @HostListener('contextmenu', ['$event']) onRightClick($event: MouseEvent): void {
    if (!this.isTopmostTarget($event)) {
      return;
    }
    $event.preventDefault();
    const [posX, posY] = [$event.pageX, $event.pageY];
    if ($event.ctrlKey) {
      this.statletManager.createGroup(new CanvasPosition(posX, posY));
    } else {
      this.statletManager.createStatlet(new CanvasPosition(posX, posY));
    }
  }

  private isTopmostTarget(event: Event): boolean {
    return event.target === event.currentTarget;
  }

  @HostListener('dblclick', ['$event']) onDoubleClick($event: MouseEvent): void {
    $event.preventDefault();
    [this.canvasPosition.x, this.canvasPosition.y] = [$event.pageX, $event.pageY];
    this.show = true;
  }

  constructor(
    private plumbing: PlumbingService,
    public statletManager: StatletManagerService,
  ) { }

  ngAfterViewInit() {
    this.initializePlumbing();
    this.updateConnections();
  }

  private initializePlumbing(): void {
    this.plumbing.setContainer(this.htmlId);
  }

  private updateConnections(): void {
    this.allStatlets.forEach(statlet => statlet.inputs.forEach(parameter => {
      if (parameter.isLinked()) {
        this.plumbing.connect(parameter.linkedParameter.uuid, parameter.uuid);
      }
    }))
  }


  private setShow(event): void {
    this.show = event;
  }
}
