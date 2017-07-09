import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './canvas-position';
import { ParameterList } from './parameter-list';

export enum StatletState {
  ready,
  busy,
}

export class Statlet {
  currentState: StatletState = StatletState.ready;

  constructor(
    public id: number,
    public title: string,
    public code: string,
    public consoleOutput: string,
    public position: CanvasPosition,
    public inputList: ParameterList,
    public outputList: ParameterList,
    private remoteR: RemoteRService,
  ) { }

  execute(): void {
    this.currentState = StatletState.busy;
    this.remoteR.execute(
      this.code,
      this.inputList,
    ).then(outputs => {
      this.updateStatletOutputsWithOpenCpuOutput(outputs);
    }).catch(() => {
    }).then(() => {
      this.currentState = StatletState.ready;
    });
  }

  private updateStatletOutputsWithOpenCpuOutput(outputs: any[]): void {
    for (let index = 0; index < outputs.length; index++) {
      this.outputList.get(index).value = outputs[index];
    }
  }

}
