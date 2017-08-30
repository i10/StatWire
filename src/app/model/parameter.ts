import { UUID } from 'angular2-uuid';

export class Parameter {
  uuid: string;
  manualInput = '';
  file: File = null;
  useFile = false;
  linkedParameter: Parameter = null;
  displayText: string = '';

  constructor(
    public name: string,
  ) {
    this.uuid = UUID.UUID();
  }

  get value(): any {
    if (this.linkedParameter) {
      this.displayText = JSON.stringify(this.linkedParameter.value);

      return this.linkedParameter.value;
    } else {
      if (this.useFile) {
        return this.file;
      } else {
        return this.manualInput;
      }
    }
  }

  set value(newValue: any) {
    this.manualInput = newValue;
  }

  valueNeedsEvaluation(): boolean {
    return !this.isLinked() && !this.useFile;
  }

  isLinked(): boolean {
    return this.linkedParameter !== null;
  }

  linkTo(target: Parameter): void {
    target.linkedParameter = this;
  }

  unlink(target: Parameter): void {
    target.linkedParameter = null;
  }
}
