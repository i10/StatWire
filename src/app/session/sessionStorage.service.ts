import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { Observable } from 'rxjs/Observable';

import { CanvasPosition } from '../model/nodes/canvas-position';
import { InputParameter } from '../model/nodes/parameters/inputParameter';
import { OutputParameter } from '../model/nodes/parameters/outputParameter';
import { Parameter } from '../model/nodes/parameters/parameter';
import { Statlet } from '../model/nodes/statlet';
import { RemoteRService } from '../remote-r.service';

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

    delete object['actions'];
    Object.assign(statlet, object);
    Object.assign(statlet, {remoteR: this.remoteR});

    statlet.inputs =
      statlet.inputs.map((nakedParameter) => this.clotheGenericObjectToAParameter(InputParameter, nakedParameter));
    statlet.outputs =
      statlet.outputs.map((nakedParameter) => this.clotheGenericObjectToAParameter(OutputParameter, nakedParameter));

    return statlet;
  }

  private clotheGenericObjectToAParameter<T extends Parameter>(
    TConstructor: new (name: string) => T,
    object: object,
  ): T {
    const parameter = new TConstructor('naked');

    Object.assign(parameter, object);

    return parameter;
  }
}
