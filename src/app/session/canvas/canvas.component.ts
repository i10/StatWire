import { AfterViewInit, Component, HostBinding, HostListener } from '@angular/core';

import BootstrapMenu from 'bootstrap-menu';
import { GraphicWidget } from '../../model/graphic-widget';

import { CanvasPosition } from '../../model/nodes/canvas-position';
import { Statlet } from '../../model/nodes/statlet';
import { ViewerNode } from '../../model/nodes/viewer-node';
import { StatletManagerService } from '../../model/statlet-manager.service';
import { PlumbingService } from './plumbing.service';

@Component({
  selector: 'sl-canvas',
  templateUrl: './canvas.component.html',
  providers: [PlumbingService],
})
export class CanvasComponent implements AfterViewInit {
  private show = false;
  private canvasPosition: CanvasPosition = {x: 0, y: 0};
  private capturedCanvasPosition: CanvasPosition = {x: 0, y: 0};

  private contextMenuActions: Array<Object> = [{
    name: 'Create StatLet',
    onClick: (self) => {
      this.statletManager.createStatlet(new CanvasPosition(this.capturedCanvasPosition.x, this.capturedCanvasPosition.y));
    },
  }, {
    name: 'Create Viewer Widget',
    onClick: (self) => {
      this.statletManager.createViewerNode(new CanvasPosition(this.capturedCanvasPosition.x, this.capturedCanvasPosition.y));
    },
  }];

  @HostBinding('id') htmlId = 'sl-canvas';

  @HostListener('contextmenu', ['$event'])
  setCanvasPosition($event: MouseEvent): void {
    $event.preventDefault();
    [this.capturedCanvasPosition.x, this.capturedCanvasPosition.y] = [$event.pageX, $event.pageY];
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick($event: MouseEvent): void {
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

  get allGraphicWidgets(): GraphicWidget[] {
    return this.statletManager.allGraphicWidgets;
  }

  ngAfterViewInit() {
    this.initializePlumbing();
    this.registerConnectionCallbacks();
    this.updateConnections();
    this.initializeContextMenu();
  }

  private initializePlumbing(): void {
    this.plumbing.setContainer(this.htmlId);
  }

  // jsPlumb necessitates a global callback, so we can't handle the two cases in their components.
  private registerConnectionCallbacks() {
    this.setOnConnectionCallback();
    this.setOnDisconnectCallback();
  }

  private updateConnections(): void {
    this.plumbing.repaintEverything();
    this.allStatlets.forEach(statlet => statlet.inputs.forEach(parameter => {
      if (parameter.isLinked()) {
        this.plumbing.connect(parameter.source.uuid, parameter.uuid);
      }
    }));
  }

  private setShow(event): void {
    this.show = event;
  }

  private initializeContextMenu(): void {
    const menu = new BootstrapMenu('#sl-canvas', {
      actions: this.contextMenuActions,
    });
  }

  private setOnConnectionCallback(): void {
    this.plumbing.onConnection((info) => {
      const sourceId = info.sourceId;
      const targetId = info.targetId;
      switch (this.getConnectionType(sourceId, targetId)) {
        case ConnectionType.LinkedParameters:
          this.connectParameters(sourceId, targetId);
          break;
        case ConnectionType.ViewerInput:
          this.setViewerInput(targetId, sourceId);
      }
    });
  }

  private getConnectionType(sourceId: string, targetId: string): ConnectionType {
    if (targetId.match(/^viewer-input:/)) {
      return ConnectionType.ViewerInput;
    } else {
      return ConnectionType.LinkedParameters;
    }
  }

  private connectParameters(sourceHtmlId: string, targetHtmlId: string): void {
    const sourceId = sourceHtmlId.replace(/^parameter:/, '');
    const targetId = targetHtmlId.replace(/^parameter:/, '');
    const source = this.statletManager.getOutput(sourceId);
    const target = this.statletManager.getInput(targetId);
    target.linkTo(source);
  }

  private setViewerInput(viewerHtmlId: string, parameterHtmlId: string) {
    const viewerId = parseInt(viewerHtmlId.replace(/^viewer-input:/, ''));
    const parameterId = parameterHtmlId.replace(/^parameter:/, '');

    const viewer = this.statletManager.getViewerNode(viewerId);
    const parameter = this.statletManager.getOutput(parameterId);
    viewer.linkedParameter = parameter;
  }

  private setOnDisconnectCallback(): void {
    this.plumbing.onDisconnect((info) => {
      const sourceId = info.sourceId;
      const targetId = info.targetId;
      switch (this.getConnectionType(sourceId, targetId)) {
        case ConnectionType.LinkedParameters:
          this.disconnectParameters(sourceId, targetId);
          break;
        case ConnectionType.ViewerInput:
          this.removeViewerInput(targetId);
      }
    });
  }

  private disconnectParameters(sourceHtmlId: string, targetHtmlId: string): void {
    const sourceId = sourceHtmlId.replace(/^parameter:/, '');
    const targetId = targetHtmlId.replace(/^parameter:/, '');
    const source = this.statletManager.getOutput(sourceId);
    const target = this.statletManager.getInput(targetId);
    target.unlink(source);
  }

  private removeViewerInput(viewerHtmlId: string) {
    const viewerId = parseInt(viewerHtmlId.replace(/^viewer-input:/, ''));
    const viewer = this.statletManager.getViewerNode(viewerId);
    viewer.linkedParameter = null;
  }
}

enum ConnectionType {
  LinkedParameters,
  ViewerInput,
}
