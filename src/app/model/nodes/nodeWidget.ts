import { Subject } from 'rxjs/Subject';
import { isFunction } from 'rxjs/util/isFunction';

import { CanvasPosition } from './canvas-position';

export class NodeWidget {
  title = '';
  actions: Array<NodeAction> = [
    new NodeAction('Clone', 'fa-clone'),
    new NodeAction('Delete', 'fa-trash'),
  ];

  constructor(
    public id: number,
    public position: CanvasPosition,
  ) { }
}

export class NodeAction {
  public subject = new Subject();

  constructor(
    public name: string,
    private _fontAwesomeClass: string | (() => string),
  ) { }

  public get fontAwesomeClass(): string | (() => string) {
    if (isFunction(this._fontAwesomeClass)) {
      return this._fontAwesomeClass();
    } else {
      return this._fontAwesomeClass;
    }
  }

  public set fontAwesomeClass(value: string | (() => string)) {
    this._fontAwesomeClass = value;
  }
}
