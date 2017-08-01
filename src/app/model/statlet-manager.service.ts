import { Injectable } from '@angular/core';

import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './canvas-position';
import { Parameter } from './parameter';
import { Statlet } from './statlet';
import { StatletGroup } from 'app/model/statletGroup';

@Injectable()
export class StatletManagerService {
  allStatlets: Array<Statlet> = [];
  allGroups: Array<StatletGroup> = [];
  activeStatlet: Statlet;

  private nextStatletId = 1;

  constructor(
    private remoteR: RemoteRService
  ) { }

  createGroup(position: CanvasPosition): StatletGroup {
    const id = this.nextStatletId;
    this.nextStatletId++;

    const group = new StatletGroup(
      id,
      position,
    );

    this.addGroup(group);
    return group;
  }

  private addGroup(group: StatletGroup): void {
    this.allGroups.push(group);
  }

  createStatlet(position: CanvasPosition): Statlet {
    const id = this.nextStatletId;
    this.nextStatletId++;

    const statlet = new Statlet(
      id,
      position,
      this.remoteR
    );
    statlet.title = `New Statlet ${id}`;
    statlet.code = 'function() {\n\treturn()\n}';

    this.addStatlet(statlet);
    this.setActiveStatlet(statlet.id);

    return statlet;
  }

  private addStatlet(statlet: Statlet): void {
    this.allStatlets.push(statlet);
  }

  deleteStatlet(statletId: number): void {
    this.resetIfActive(statletId);
    const indexToDelete = this.allStatlets.findIndex(statlet => statlet.id === statletId);
    this.allStatlets.splice(indexToDelete, 1);
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
    return null;
  }
}
