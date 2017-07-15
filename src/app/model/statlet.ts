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
    private remoteR: RemoteRService,
  ) { }

  execute(): Promise<never> {
    return new Promise((resolve, reject) => {
      this.currentState = StatletState.busy;
      const rCode = this.convertStatletCodeToRCode(this.code);

      this.remoteR.execute(rCode, this.inputList)
        .then(result => {
          this.updateOutputsFromRawValues(result.returnValue);
          this.consoleOutput = result.consoleOutput;
        })
        .catch((error) => {
          this.consoleOutput = error;
          reject();
        })
        .then(() => {
          this.currentState = StatletState.ready;
          resolve();
        });
    });
  };

  private convertStatletCodeToRCode(statletCode: string): string {
    const returnStatementPattern = /return\(([^)]*)\)/;
    const rCode = statletCode.replace(returnStatementPattern, 'return(list($1))');
    return rCode;

  }

  private updateOutputsFromRawValues(outputs: any[]): void {
    for (let index = 0; index < outputs.length; index++) {
      this.outputList.get(index).value = outputs[index];
    }
  }

}
