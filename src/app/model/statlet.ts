import { FileArgument, RemoteRService, Return } from '../remote-r.service';
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

  async execute(): Promise<void> {
      this.synchronizeParametersWithCode();

      this.currentState = StatletState.busy;
      const argsToEvaluate = this.getArgsToEvaluate(this.inputs);
      const fileArgs = this.getFiles(this.inputs);
      const serializedArgs = this.getSerializedArgs(this.inputs);

    try {
      const result = await this.remoteR.execute(this.code, argsToEvaluate, fileArgs, serializedArgs);
      this.updateOutputsFromRawValues(result.returns);
      this.consoleOutput = result.consoleOutput;
      this.graphicUrls = result.graphicUrls;
    } catch (error) {
      this.consoleOutput = error;
      throw error;
    } finally {
      this.currentState = StatletState.ready;
    }
  };

  private getArgsToEvaluate(parameterList: Array<Parameter>): object {
    const argsToEvaluate = {};
    parameterList.filter(parameter => parameter.valueNeedsEvaluation())
      .forEach(parameter => argsToEvaluate[parameter.name] = parameter.value);
    return argsToEvaluate;
  }

  private getFiles(parameterList: Array<Parameter>): Array<FileArgument> {
    return parameterList.filter(parameter => parameter.useFile)
      .map(parameter => new FileArgument(parameter.name, parameter.file));
  }

  private getSerializedArgs(parameterList: Array<Parameter>): object {
    const serializedArgs = {};
    parameterList.filter(parameter => !parameter.useFile && !parameter.valueNeedsEvaluation())
      .forEach(parameter => serializedArgs[parameter.name] = parameter.value);
    return serializedArgs;
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

  private updateOutputsFromRawValues(returnValues: Array<Return>): void {
    for (let index = 0; index < returnValues.length; index++) {
      this.outputs[index].value = returnValues[index].value;
      this.outputs[index].representation = returnValues[index].representation;
    }
  }
}
