import { CanvasPosition } from './canvas-position';
import { ParameterList } from './parameter-list';

export class Statlet {
  constructor(
    public id: number,
    public title: string,
    public code: string,
    public position: CanvasPosition,
    public inputList: ParameterList,
    public outputList: ParameterList,
  ) { }
}
