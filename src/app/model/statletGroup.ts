import { CanvasPosition } from './canvas-position';

export class StatletGroup {
  title = '';

  constructor(
    public id: number,
    public position: CanvasPosition,
  ) {
    this.title = `New group ${id}`;
  }
}
