import { Injectable } from '@angular/core';

import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './canvas-position';
import { Parameter } from './parameter';
import { ParameterList } from './parameter-list';
import { Statlet } from './statlet';

@Injectable()
export class StatletManagerService {
  allStatlets: Statlet[] = [];
  activeStatlet: Statlet;

  private nextId = 1;

  constructor(private remoteR: RemoteRService) { }

  createStatlet(position: CanvasPosition): Statlet {
    const id = this.nextId;
    this.nextId++;

    const statlet = new Statlet(
      id,
      `New Statlet ${id}`,
      'function() {\n\treturn()\n}',
      '',
      position,
      new ParameterList(),
      new ParameterList(),
      this.remoteR,
    );

    this.addStatlet(statlet);
    this.setActiveStatlet(statlet.id);

    return statlet;
  }

  private addStatlet(statlet: Statlet): void {
    this.allStatlets.push(statlet);
  }

  deleteStatlet(statletId: number): void {
    if (this.activeStatlet.id === statletId) {
      this.activeStatlet = null;
    }
    const indexToDelete = this.allStatlets.findIndex(statlet => statlet.id === statletId);
    this.allStatlets.splice(indexToDelete, 1);
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
      for (const parameter of statlet.inputList) {
        if (parameter.uuid === uuid) {
          return parameter;
        }
      }
      for (const parameter of statlet.outputList) {
        if (parameter.uuid === uuid) {
          return parameter;
        }
      }
    }
    return null;
  }
}
