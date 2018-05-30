import { FileArgument, RemoteRService, Return } from '../../remote-r.service';
import { CanvasPosition } from './canvas-position';
import { NodeAction, NodeWidget } from './nodeWidget';
import { InputParameter } from './parameters/inputParameter';
import { OutputParameter } from './parameters/outputParameter';
import { Parameter } from './parameters/parameter';

export enum StatletState {
  ready,
  busy,
}

export class Statlet extends NodeWidget {
  private _code = '';
  consoleOutput = '';
  inputs: Array<InputParameter> = [];
  outputs: Array<OutputParameter> = [];
  plots: Array<OutputParameter> = [];
  currentState = StatletState.ready;

  constructor(
    public id: number,
    public position: CanvasPosition,
    private remoteR: RemoteRService,
  ) {
    super(id, position);
    this.setCustomActions();
  }

  private setCustomActions() {
    const fontAwesomeClassSelector = () => {
      switch (this.currentState) {
        case StatletState.ready:
          return 'fa-play';
        case StatletState.busy:
          return 'fa-hourglass';
        default:
          throw new Error(`State '${this.currentState}' is invalid.`);
      }
    };
    const executeAction = new NodeAction('Execute', fontAwesomeClassSelector);
    executeAction.subject.subscribe(() => this.execute());
    this.actions.unshift(
      executeAction,
    );
  }

  set code(newCode: string) {
    this._code = newCode;
    this.synchronizeParametersWithCode();
  }

  get code(): string {
    return this._code;
  }

  setInputsUsingNames(names: Array<string>): void {
    this.inputs = this.getUpdatedParameters(InputParameter, this.inputs, names);
  }

  setOutputsUsingNames(names: Array<string>): void {
    this.outputs = this.getUpdatedParameters(OutputParameter, this.outputs, names);
  }

  private getUpdatedParameters<T extends Parameter>(
    TConstructor: new (name: string) => T,
    params: Array<T>,
    newNames: Array<string>,
  ): Array<T> {
    const newParams = [];
    const oldNames = params.map(parameter => parameter.name);
    for (const name of newNames) {
      let toAdd = new TConstructor(name);
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
      this.plots = result.plotUrls.map((url, index) => OutputParameter.fromUrl(`Plot ${index}`, url));
    } catch (error) {
      this.consoleOutput = error;
      throw error;
    } finally {
      this.currentState = StatletState.ready;
    }
  };

  async autocomplete(prefix: string): Promise<Array<object>> {
    return await this.remoteR.getFunctions(prefix);
  }

  private getArgsToEvaluate(parameterList: Array<InputParameter>): object {
    const argsToEvaluate = {};
    parameterList.filter(parameter => parameter.valueNeedsEvaluation())
      .forEach(parameter => argsToEvaluate[parameter.name] = parameter.value);
    return argsToEvaluate;
  }

  private getFiles(parameterList: Array<InputParameter>): Array<FileArgument> {
    return parameterList.filter(parameter => parameter.useFile)
      .map(parameter => new FileArgument(parameter.name, parameter.file));
  }

  private getSerializedArgs(parameterList: Array<InputParameter>): object {
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
