import { Subject } from 'rxjs/Subject';
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
    public fontAwesomeClass: string,
  ) { }
}
