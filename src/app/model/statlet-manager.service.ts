import { Injectable } from '@angular/core';
import { Statlet } from 'app/model/statlet';
import { CanvasPosition } from './canvas-position';
import { ParameterList } from './parameter-list';

@Injectable()
export class StatletManagerService {
  private statlets: Statlet[];

  constructor() { }

  createStatlet(title: string, position: CanvasPosition): Statlet {
    const statlet = new Statlet(
      this.statlets.length + 1,
      title,
      '',
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

}
