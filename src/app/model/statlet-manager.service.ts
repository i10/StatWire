import { Injectable } from '@angular/core';
import { Statlet } from 'app/model/statlet';
import { CanvasPosition } from './canvas-position';
import { ParameterList } from './parameter-list';
import { Parameter } from './parameter';

@Injectable()
export class StatletManagerService {
  private statlets: Statlet[] = [];

  constructor() { }

  createStatlet(title: string, position: CanvasPosition): Statlet {
    const statlet = new Statlet(
      this.statlets.length + 1,
      title,
      'function() {\n\treturn()\n}',
      position,
      new ParameterList(),
      new ParameterList(),
    );
    this.addStatlet(statlet);
    return statlet;
  }

  private addStatlet(statlet: Statlet): void {
    this.statlets.push(statlet);
  }

  getStatlet(statletId: number): Statlet {
    return this.statlets.find(statlet => statlet.id === statletId);
  }

  getAllStatlets(): Statlet[] {
    return this.statlets;
  }

  getParameter(uuid: string): Parameter {
    for (const statlet of this.statlets) {
      for (const parameter of statlet.inputList) {
        if (parameter.id === uuid) {
          return parameter;
        }
      }
      for (const parameter of statlet.outputList) {
        if (parameter.id === uuid) {
          return parameter;
        }
      }
    }
    return null;
  }
}
