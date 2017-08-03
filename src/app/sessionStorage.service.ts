import { Injectable } from '@angular/core';
import { Statlet } from './model/statlet';
import { Parameter } from './model/parameter';
import { CanvasPosition } from './model/canvas-position';
import { RemoteRService } from './remote-r.service'
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SessionStorageService {
  private currentStatlets: Array<Statlet> = [];

  constructor(
    private remoteR: RemoteRService
  ) { }

  subscribeTo(subject: Subject<Statlet[]>): void {
    subject.subscribe(allStatlets => this.update(allStatlets))
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
    return JSON.stringify(object);
  }

  private get(name: string): Array<Statlet> {
    return this.parseToJSON(sessionStorage.getItem(name));
  }

  private parseToJSON(JSONAsString: string): Array<Statlet> {
    const nakedStatletArray = JSON.parse(JSONAsString);
    const statletArray = nakedStatletArray.map((nakedObject) => this.clotheGenericObjectToAStatlet(nakedObject));

    return statletArray;
  }

  private clotheGenericObjectToAStatlet(object: object): Statlet {
    const statlet = new Statlet(-1, new CanvasPosition(0, 0), this.remoteR);

    Object.assign(statlet, object);
    Object.assign(statlet, { remoteR: this.remoteR });

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
