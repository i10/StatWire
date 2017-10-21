import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './canvas-position';
import { Parameter } from './parameter';

export enum StatletState {
  ready,
  busy,
}

export class Statlet {
  title = '';
  private _code = '';
  consoleOutput = '';
  inputs: Array<Parameter> = [];
  outputs: Array<Parameter> = [];
  graphicUrls: Array<string> = [];
  currentState = StatletState.ready;

  constructor(
    public id: number,
    public position: CanvasPosition,
    private remoteR: RemoteRService,
  ) { }

  set code(newCode: string) {
    this._code = newCode;
    this.synchronizeParametersWithCode();
  }

  get code(): string {
    return this._code;
  }

  setInputsUsingNames(names: Array<string>): void {
    this.inputs = this.getUpdatedParameters(this.inputs, names);
  }

  setOutputsUsingNames(names: Array<string>): void {
    this.outputs = this.getUpdatedParameters(this.outputs, names);
  }

  private getUpdatedParameters(params: Array<Parameter>, newNames: Array<string>): Array<Parameter> {
    const newParams = [];
    const oldNames = params.map(parameter => parameter.name);
    for (const name of newNames) {
      let toAdd = new Parameter(name);
      if (oldNames.includes(name)) {
        toAdd = params.find(parameter => parameter.name === name);
      }
      newParams.push(toAdd);
    }
    return newParams;
  }

  execute(): Promise<never> {
    return new Promise((resolve, reject) => {
      this.synchronizeParametersWithCode();

      this.currentState = StatletState.busy;
      const args = this.getArgObject(this.inputs);

      this.remoteR.execute(this.code, args)
        .then(result => {
          this.updateOutputsFromRawValues(result.returnValue);
          this.consoleOutput = result.consoleOutput;
          this.graphicUrls = result.graphicUrls;
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


  private updateOutputsFromRawValues(outputs: any[]): void {
    for (let index = 0; index < outputs.length; index++) {
      this.outputs[index].value = outputs[index];
      this.outputs[index].displayText = JSON.stringify(outputs[index]);
    }
  }

  synchronizeParametersWithCode(): void {
    const updatedInputNames = this.getInputNamesFromCode(this.code);
    if (updatedInputNames) {
      this.setInputsUsingNames(updatedInputNames);
    }
    const updatedOutputNames = this.getOutputNamesFromCode(this.code);
    if (updatedOutputNames) {
      this.setOutputsUsingNames(updatedOutputNames);
    }
  }

  private getInputNamesFromCode(code: string): Array<string> {
    const functionHeaderPattern = /function\(([^)]*?)\)/;
    const inputNames = this.parseParameters(code, functionHeaderPattern);
    return inputNames;
  }

  private getOutputNamesFromCode(code: string): Array<string> {
    const returnStatementPattern = /return\(([^)]*?)\)/;
    const outputNames = this.parseParameters(code, returnStatementPattern);
    return outputNames;
  }

  private parseParameters(code: string, pattern: RegExp): Array<string> {
    const match = pattern.exec(code);
    if (!match) {
      return null;
    }
    const allParameters = match[1];
    if (allParameters === '') {
      return [];
    }
    const parameterList = allParameters.split(/\s*,\s*/);
    return parameterList;
  }
}
