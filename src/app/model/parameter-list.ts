import { Parameter } from './parameter';

export class ParameterList implements Iterable<Parameter> {
  private parameters: Parameter[] = [];

  addParameter(name: string): ParameterList {
    this.parameters.push(new Parameter(name));
    return this;
  }

  count(): number {
    return this.parameters.length;
  }

  get(index: number): Parameter {
    return this.parameters[index];
  }

  [Symbol.iterator]() {
    return this.parameters[Symbol.iterator]();
  }

  updateWith(newList: ParameterList): void {
    const newParameters = [];
    for (const parameter of newList) {
      if (this.hasParameterWithSameName(parameter)) {
        const index = this.parameters.findIndex(ownParam => ownParam.name === parameter.name);
        newParameters.push(this.parameters[index]);
      } else {
        newParameters.push(parameter);
      }
    }

    this.parameters = newParameters;
  }

  private hasParameterWithSameName(toFind: Parameter): boolean {
    const index = this.parameters.findIndex(ownParam => ownParam.name === toFind.name);
    return index !== -1;
  }

  print(): string {
    const names = this.parameters.map(parameter => parameter.name);
    return names.join(', ');
  }
}
