import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './canvas-position';
import { Parameter } from './parameter';

export enum ViewerNodeState {
  ready,
  busy,
}


export class ViewerNode {
  title = '';
  consoleOutput = '';
  private _code = '';
  inputs: Array<Parameter> = [];
  graphicUrls: Array<string> = [];
  currentState = ViewerNodeState.ready;

  constructor(
    public id: number,
    public position: CanvasPosition,
    private remoteR: RemoteRService,
  ) {
    this.inputs = [new Parameter('inputVariable')];
  }

  get code(): string {
    return this._code;
  }

  execute(): Promise<never> {
    return new Promise((resolve, reject) => {

      this.currentState = ViewerNodeState.busy;
      const rCode = this.convertStatletCodeToRCode(this.code);

      console.log('rCode: ' + rCode);
      const args = this.getArgObject(this.inputs);

      this.remoteR.execute(rCode, args)
        .then(result => {
          this.updateOutputsFromRawValues(result.returns);
          this.consoleOutput = result.consoleOutput;

          console.log(this.consoleOutput);
          this.graphicUrls = result.graphicUrls;
        })
        .catch((error) => {
          this.consoleOutput = error;
          reject();
        })
        .then(() => {
          this.currentState = ViewerNodeState.ready;
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
      console.log(outputs);
    }
  }

  private getArgObject(parameterList: Array<Parameter>): any {
    const argObject = {argsToEvaluate: []};
    for (const parameter of parameterList) {
      if (parameter.name === 'func') {
        console.error('Parameters cannot be called func, currently.');
      }
      if (parameter.valueNeedsEvaluation()) {
        argObject.argsToEvaluate.push(parameter.value);
      } else {
        argObject[parameter.name] = parameter.value;
      }
    }
    return argObject;
  }
}
