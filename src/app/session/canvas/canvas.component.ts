declare var require: any
import { AfterViewInit, Component, HostBinding, HostListener } from '@angular/core';

import { CanvasPosition } from '../../model/canvas-position';
import { Statlet } from '../../model/statlet';
import { StatletManagerService } from '../../model/statlet-manager.service';
import { PlumbingService } from './plumbing.service';

var BootstrapMenu = require('bootstrap-menu');

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
    $event.preventDefault();
    const [posX, posY] = [$event.pageX, $event.pageY];
    this.statletManager.createStatlet(new CanvasPosition(posX, posY));
  }

  @HostListener('dblclick', ['$event']) onDoubleClick($event: MouseEvent): void {
    $event.preventDefault();
    [this.canvasPosition.x, this.canvasPosition.y] = [$event.pageX, $event.pageY];
    this.show = true;
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
    this.initializeContextMenu();
  }

  private initializePlumbing(): void {
    this.plumbing.setContainer(this.htmlId);
  }

  private updateConnections(): void {
    this.plumbing.repaintEverything();
    this.allStatlets.forEach(statlet => statlet.inputs.forEach(parameter => {
      if (parameter.isLinked()) {
        this.plumbing.connect(parameter.linkedParameter.uuid, parameter.uuid);
      }
    }))
  }

  private initializeContextMenu(): void {
    let menu = new BootstrapMenu('#sl-canvas', {
      actions: [{
      name: 'Action',
      onClick: function() {
          // run when the action is clicked
        }
      }, {
        name: 'Another action',
        onClick: function() {
          // run when the action is clicked
        }
      }, {
        name: 'A third action',
        onClick: function() {
          // run when the action is clicked
        }
      }]
    })
  }

  private setShow(event): void {
    this.show = event;
  }
}
