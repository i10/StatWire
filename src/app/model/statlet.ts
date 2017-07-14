import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './canvas-position';
import { ParameterList } from './parameter-list';

export enum StatletState {
  ready,
  busy,
}

export class Statlet {
  title = '';
  code = '';
  consoleOutput = '';
  inputList = new ParameterList();
  outputList = new ParameterList();
  currentState = StatletState.ready;

  constructor(
    public id: number,
    public position: CanvasPosition,
    public remoteR: RemoteRService,
  ) { }

  execute(): void {
    this.currentState = StatletState.busy;
    this.remoteR.execute(this.code, this.inputList)
      .then(result => {
        this.updateOutputsFromRawValues(result.returnValue);
        this.consoleOutput = result.consoleOutput;
      })
      .catch((error) => {
        this.consoleOutput = error;
      })
      .then(() => {
        this.currentState = StatletState.ready;
      });
  }

  private updateOutputsFromRawValues(outputs: any[]): void {
    for (let index = 0; index < outputs.length; index++) {
      this.outputList.get(index).value = outputs[index];
    }
  }

}
