import { CanvasPosition } from './canvas-position';
import { Node } from './node';
import { Parameter } from './parameter';

export class ViewerNode extends Node {
  linkedParameter: Parameter;

  constructor(
    public id: number,
    public position: CanvasPosition,
  ) {
    super(id, position);
  }
}
