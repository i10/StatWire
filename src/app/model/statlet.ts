import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './canvas-position';
import { ParameterList } from './parameter-list';
import { Parameter } from './parameter';

export enum StatletState {
  ready,
  busy,
}

export class Statlet {
  title = '';
  code = '';
  consoleOutput = '';
  inputs: Array<Parameter> = [];
  outputs: Array<Parameter> = [];
  inputList = new ParameterList();
  outputList = new ParameterList();
  currentState = StatletState.ready;

  constructor(
    public id: number,
    public position: CanvasPosition,
    private remoteR: RemoteRService,
  ) { }

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
      this.outputs[index].value = outputs[index];
    }
  }

  synchronizeParametersWithCode(): void {
    const updatedInputList = this.getInputList(this.code);
    this.inputList.updateWith(updatedInputList);
    const updatedOutputList = this.getOutputList(this.code);
    this.outputList.updateWith(updatedOutputList);
  }

  private getInputList(code: string): ParameterList {
    const functionHeaderPattern = /function\(([^)]*?)\)/;
    const inputNames = this.parseParameters(code, functionHeaderPattern);
    return this.makeParameterList(inputNames);
  }

  private getOutputList(code: string): ParameterList {
    const returnStatementPattern = /return\(([^)]*?)\)/;
    const outputNames = this.parseParameters(code, returnStatementPattern);
    return this.makeParameterList(outputNames);
  }

  private parseParameters(code: string, pattern: RegExp): Array<string> {
    const match = pattern.exec(code);
    if (!match) {
      console.error('No match was found');
      return [];
    }
    const allParameters = match[1];
    if (allParameters === '') {
      return [];
    }
    const parameterList = allParameters.split(/\s*,\s*/);
    return parameterList;
  }

  private makeParameterList(parameterNames: string[]) {
    const updatedParameterList = new ParameterList();
    for (const parameter of parameterNames) {
      updatedParameterList.addParameter(parameter);
    }
    return updatedParameterList;
  }
}
