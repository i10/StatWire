import { CanvasPosition } from './canvas-position';

export class Node {
  title = '';

  constructor(
    public id: number,
    public position: CanvasPosition,
  ) { }
}
