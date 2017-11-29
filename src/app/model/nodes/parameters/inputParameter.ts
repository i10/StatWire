import { OutputParameter } from './outputParameter';
import { Parameter } from './parameter';

export class InputParameter extends Parameter {
  source: OutputParameter = null;

  manualInput = '';
  file: File = null;
  useFile = false;

  get value(): any {
    if (this.source) {
      return this.source.value;
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
    return this.source !== null;
  }

  linkTo(target: OutputParameter): void {
    this.source = target;
  }

  unlink(target: OutputParameter): void {
    this.source = target;
  }
}
