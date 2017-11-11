import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { Observable } from 'rxjs/Observable';

import { CanvasPosition } from './model/nodes/canvas-position';
import { Parameter } from './model/nodes/parameter';
import { Statlet } from './model/nodes/statlet';
import { RemoteRService } from './remote-r.service';

@Injectable()
export class SessionStorageService {
  private currentStatlets: Array<Statlet> = [];

  constructor(
    private remoteR: RemoteRService,
  ) { }

  subscribeTo(observable: Observable<Statlet[]>): void {
    observable.subscribe(allStatlets => this.update(allStatlets));
  }

  update(currentStatlets: Array<Statlet>): void {
    sessionStorage.clear();
    this.set('currentStatlets', currentStatlets);
  }

  pop(): Array<Statlet> {
    this.currentStatlets = this.get('currentStatlets');

    return this.currentStatlets;
  }

  private set(name: string, object: Array<Statlet>): void {
    sessionStorage.setItem(name, this.stringify(object));
  }

  private stringify(object: Array<Statlet>): string {
    object = _.cloneDeep(object);
    object.forEach(statlet => {
      statlet.actions.forEach(action => {
        action.subject.unsubscribe();
      });
    });
    return JSON.stringify(object);
  }

  private get(name: string): Array<Statlet> {
    return this.parseToJSON(sessionStorage.getItem(name));
  }

  private parseToJSON(JSONAsString: string): Array<Statlet> {
    const nakedStatletArray = JSON.parse(JSONAsString);
    const statletArray =
      nakedStatletArray !== null
        ? nakedStatletArray.map((nakedObject) => this.clotheGenericObjectToAStatlet(nakedObject))
        : [];

    return statletArray;
  }

  private clotheGenericObjectToAStatlet(object: object): Statlet {
    const statlet = new Statlet(-1, new CanvasPosition(0, 0), this.remoteR);

    Object.assign(statlet, object);
    Object.assign(statlet, {remoteR: this.remoteR});

    statlet.inputs = statlet.inputs.map((nakedParameter) => this.clotheGenericObjectToAParameter(nakedParameter));
    statlet.outputs = statlet.outputs.map((nakedParameter) => this.clotheGenericObjectToAParameter(nakedParameter));

    return statlet;
  }

  private clotheGenericObjectToAParameter(object: object): Parameter {
    const parameter = new Parameter('naked');

    Object.assign(parameter, object);

    return parameter;
  }
}
