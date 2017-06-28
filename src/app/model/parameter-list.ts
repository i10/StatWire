import { Parameter } from './parameter';

export class ParameterList {
  private parameters: Parameter[] = [];

  addParameter(name: string): ParameterList {
    this.parameters.push(new Parameter(name));
    return this;
  }

  get(index: number): Parameter {
    return this.parameters[index];
  }

  [Symbol.iterator]() {
    return this.parameters[Symbol.iterator]();
  }

  printParameters(): string {
    const names = this.parameters.map(parameter => parameter.name);
    return names.join(', ');
  }
}