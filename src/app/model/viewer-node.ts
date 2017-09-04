import { RemoteRService } from '../remote-r.service';
import { CanvasPosition } from './canvas-position';
import { Parameter } from './parameter';

export class ViewerNode {
  title = '';
  consoleOutput = '';
  input: Parameter = null;
  graphicUrls: Array<string> = [];

  constructor(
    public id: number,
    public position: CanvasPosition,
    private remoteR: RemoteRService,
  ) { }


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
