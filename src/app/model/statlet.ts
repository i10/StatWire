import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './canvas-position';
import { Parameter } from './parameter';
import { StatletManagerService } from './statlet-manager.service';

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
  graphicUrls: Array<string> = [];
  currentState = StatletState.ready;

  constructor(
    public id: number,
    public position: CanvasPosition,
    private remoteR: RemoteRService,
    private statletManager: StatletManagerService,
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
      let toAdd = new Parameter(name, this.id, this.statletManager);
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
      const rCode = this.convertStatletCodeToRCode(this.code);

      this.remoteR.execute(rCode, this.inputs)
        .then(result => {
          this.updateOutputsFromRawValues(result.returnValue);
          this.consoleOutput = result.consoleOutput;
          this.graphicUrls = result.graphicUrls;
          console.log(this.graphicUrls)
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
    const updatedInputNames = this.getInputNamesFromCode(this.code);
    this.setInputsUsingNames(updatedInputNames);
    const updatedOutputNames = this.getOutputNamesFromCode(this.code);
    this.setOutputsUsingNames(updatedOutputNames);
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
}
