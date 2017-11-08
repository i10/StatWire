import { Injectable } from '@angular/core';

import 'rxjs/add/observable/timer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './canvas-position';
import { GraphicWidget } from './graphic-widget';
import { Parameter } from './parameter';
import { Statlet } from './statlet';
import { ViewerNode } from './viewer-node';

@Injectable()
export class StatletManagerService {
  allStatlets: Statlet[] = [];
  allViewerNodes: ViewerNode[] = [];
  allGraphicWidgets: GraphicWidget[] = [];
  activeStatlet: Statlet;

  onChange = new Subject<Statlet[]>();

  private nextStatletId = 1;

  constructor(
    private remoteR: RemoteRService,
  ) {
    Observable.timer(0, 500).subscribe(
      () => this.onChange.next(this.allStatlets));
  }

  createStatlet(position: CanvasPosition, code?: string): Statlet {
    const id = this.nextStatletId;
    this.nextStatletId++;

    const statlet = new Statlet(
      id,
      position,
      this.remoteR,
    );
    statlet.title = `New Statlet ${id}`;
    if (code === undefined) {
      statlet.code = 'function() {\n\treturn()\n}';
    } else {
      statlet.code = code;
    }

    this.addStatlet(statlet);
    this.setActiveStatlet(statlet.id);

    this.updateSession();

    return statlet;
  }

  createViewerNode(position: CanvasPosition): ViewerNode {
    const id = this.nextStatletId;
    this.nextStatletId++;

    const viewerNode = new ViewerNode(
      id,
      position,
    );

    viewerNode.title = `New Viewer Widget ${id}`;
    this.addViewerNode(viewerNode);
    // this.setActiveStatlet(statlet.id);

    this.updateSession();

    return viewerNode;
  }

  createGraphicWidget(position: CanvasPosition, URL: string): GraphicWidget {
    const id = this.nextStatletId;
    this.nextStatletId++;

    const graphicWidget = new GraphicWidget(
      id,
      position,
      URL,
    );

    // graphicWidget.title = `New Graphic Widget ${id}`;
    this.addGraphicWidget(graphicWidget);
    // this.setActiveStatlet(statlet.id);

    this.updateSession();

    return graphicWidget;
  }

  private addStatlet(statlet: Statlet): void {
    this.allStatlets.push(statlet);
  }

  private addViewerNode(viewerNode: ViewerNode): void {
    this.allViewerNodes.push(viewerNode);
  }

  private addGraphicWidget(graphicWidget: GraphicWidget): void {
    this.allGraphicWidgets.push(graphicWidget);
  }

  deleteStatlet(statletId: number): void {
    this.resetIfActive(statletId);
    const indexToDelete = this.allStatlets.findIndex(statlet => statlet.id === statletId);
    this.allStatlets.splice(indexToDelete, 1);

    this.updateSession();
  }

  deleteViewerNode(viewerNodeId: number): void {
    // this.resetIfActive(statletId);
    const indexToDelete = this.allViewerNodes.findIndex(viewerNode => viewerNode.id === viewerNodeId);
    this.allViewerNodes.splice(indexToDelete, 1);

    this.updateSession();
  }

  deleteGraphicWidget(graphicWidgetId: number): void {
    // this.resetIfActive(statletId);
    const indexToDelete = this.allGraphicWidgets.findIndex(graphicWidget => graphicWidget.id === graphicWidgetId);
    this.allGraphicWidgets.splice(indexToDelete, 1);

    this.updateSession();
  }

  deleteEverything(): void {
    this.allStatlets = [];
    this.allViewerNodes = [];
    this.allGraphicWidgets = [];
    this.activeStatlet = null;
    this.onChange.next(this.allStatlets);
    this.computeStatletId();
  }

  private resetIfActive(statletId: number): void {
    if (this.activeStatlet && this.activeStatlet.id === statletId) {
      this.activeStatlet = null;
    }
  }

  getStatlet(statletId: number): Statlet {
    return this.allStatlets.find(statlet => statlet.id === statletId);
  }

  setActiveStatlet(statletId: number) {
    const newActiveStatlet = this.getStatlet(statletId);
    this.activeStatlet = newActiveStatlet;
  }

  getParameter(uuid: string): Parameter {
    for (const statlet of this.allStatlets) {
      for (const parameter of statlet.inputs) {
        if (parameter.uuid === uuid) {
          return parameter;
        }
      }
      for (const parameter of statlet.outputs) {
        if (parameter.uuid === uuid) {
          return parameter;
        }
      }
    }
    for (const viewerNode of this.allViewerNodes) {
      if (viewerNode.linkedParameter && viewerNode.linkedParameter.uuid === uuid) {
        return viewerNode.linkedParameter;
      }
    }
    return null;
  }

  private updateSession(): void {
    this.onChange.next(this.allStatlets);
  }

  public overrideAllStatlets(allStatlets: Statlet[]): void {
    this.allStatlets = allStatlets;

    this.computeStatletId();
  }

  private computeStatletId(): void {
    this.nextStatletId = 1;
    for (let i = 0; i < this.allStatlets.length; ++i) {
      if (this.allStatlets[i].id >= this.nextStatletId) {
        this.nextStatletId = this.allStatlets[i].id + 1;
      }
    }
  }

  getViewerNode(viewerId: number): ViewerNode {
    for (const viewer of this.allViewerNodes) {
      if (viewer.id === viewerId) {
        return viewer;
      }
    }
  }
}
