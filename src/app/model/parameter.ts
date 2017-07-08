import { UUID } from 'angular2-uuid';

export class Parameter {
  uuid: string;
  private reference = {value: undefined};

  constructor(
    public name: string,
  ) {
    this.uuid = UUID.UUID();
  }

  get value(): any {
    return this.reference.value;
  }

  set value(newValue: any) {
    this.reference.value = newValue;
  }

  linkTo(target: Parameter): void {
    target.reference = this.reference;
  }

  unlink(target: Parameter): void {
    target.reference = {value: this.reference.value};
  }
}
