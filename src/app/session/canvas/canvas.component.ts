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

  constructor(
    private plumbing: PlumbingService,
    private statletManager: StatletManagerService,
  ) { }

  get allStatlets(): Statlet[] {
    return this.statletManager.allStatlets;
  }

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

}
