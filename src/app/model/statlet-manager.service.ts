import { Injectable } from '@angular/core';

import 'rxjs/add/observable/timer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './nodes/canvas-position';
import { InputParameter } from './nodes/parameters/inputParameter';
import { OutputParameter } from './nodes/parameters/outputParameter';
import { Statlet } from './nodes/statlet';
import { ViewerNode } from './nodes/viewer-node';

@Injectable()
export class StatletManagerService {
  allStatlets: Statlet[] = [];
  allViewerNodes: ViewerNode[] = [];
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
    const cloneAction = statlet.actions.find(action => action.name === 'Clone');
    cloneAction.subject.subscribe(() => this.duplicateStatlet(statlet.id));
    const deleteAction = statlet.actions.find(action => action.name === 'Delete');
    deleteAction.subject.subscribe(() => this.deleteStatlet(statlet.id));
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

  private addStatlet(statlet: Statlet): void {
    this.allStatlets.push(statlet);
  }

  private addViewerNode(viewerNode: ViewerNode): void {
    this.allViewerNodes.push(viewerNode);
  }

  duplicateStatlet(statletId: number): void {
    const toDuplicate = this.allStatlets.find(statlet => statlet.id === statletId);
    const offsetPosition = new CanvasPosition(toDuplicate.position.x + 100, toDuplicate.position.y + 100);
    this.createStatlet(offsetPosition, toDuplicate.code);
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

  deleteEverything(): void {
    this.allStatlets = [];
    this.allViewerNodes = [];
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

  getInputParameter(uuid: string): InputParameter {
    for (const statlet of this.allStatlets) {
      for (const parameter of statlet.inputs) {
        if (parameter.uuid === uuid) {
          return parameter;
        }
      }
    }
    return null;
  }

  getOutputParameter(uuid: string): OutputParameter {
    for (const statlet of this.allStatlets) {
      for (const parameter of statlet.outputs) {
        if (parameter.uuid === uuid) {
          return parameter;
        }
      }
      for (const parameter of statlet.plots) {
        if (parameter.uuid === uuid) {
          return parameter;
        }
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
