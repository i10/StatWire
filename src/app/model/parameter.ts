import { UUID } from 'angular2-uuid';
import { Injectable } from '@angular/core';

import { StatletManagerService } from './statlet-manager.service';

@Injectable()
export class Parameter {
  uuid: string;
  manualInput = '';
  linkedParameter: Parameter = null;

  constructor(
    public name: string,
  ) {
    this.uuid = UUID.UUID();
  }

  get value(): any {
    if (this.linkedParameter) {
      return this.linkedParameter.value;
    } else {
      return this.manualInput;
    }
  }

  set value(newValue: any) {
    this.manualInput = newValue;
  }

  linkTo(target: Parameter): void {
    target.linkedParameter = this;
  }

  unlink(target: Parameter): void {
    target.linkedParameter = null;
  }
}
