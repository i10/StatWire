declare var require: any
import { AfterViewInit, Component, HostBinding, HostListener } from '@angular/core';

import { CanvasPosition } from '../../model/canvas-position';
import { Statlet } from '../../model/statlet';
import { ViewerNode } from '../../model/viewer-node';
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
  private capturedCanvasPosition: CanvasPosition = { x: 0, y: 0};

  private contextMenuActions: Array<Object> = [{
      name: 'Create StatLet',
      onClick: (self) => {
        this.statletManager.createStatlet(new CanvasPosition(this.capturedCanvasPosition.x, this.capturedCanvasPosition.y));
      }
    }, {
      name: 'Create Viewer Widget',
      onClick: (self) => {
      this.statletManager.createViewerNode(new CanvasPosition(this.capturedCanvasPosition.x, this.capturedCanvasPosition.y));
    }
  }];

  @HostBinding('id') htmlId = 'sl-canvas';

  @HostListener('contextmenu', ['$event']) setCanvasPosition($event: MouseEvent): void {
    $event.preventDefault();
    [this.capturedCanvasPosition.x, this.capturedCanvasPosition.y] = [$event.pageX, $event.pageY];
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

  get allViewerNodes(): ViewerNode[] {
    return this.statletManager.allViewerNodes;
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
      actions: this.contextMenuActions
    })
  }

  private setShow(event): void {
    this.show = event;
  }
}
