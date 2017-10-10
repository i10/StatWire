import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './canvas-position';

export enum GraphicWidgetState {
  ready,
  busy,
}

export class GraphicWidget {
  currentState = GraphicWidgetState.ready;

  constructor(
    public id: number,
    public position: CanvasPosition,
    public URL: string,
  ) {
    // this.inputs = [new Parameter("inputVariable")];
  }
}