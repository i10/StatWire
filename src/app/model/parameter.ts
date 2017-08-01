import { UUID } from 'angular2-uuid';
import { Injectable } from '@angular/core';

import { StatletManagerService } from './statlet-manager.service';

@Injectable()
export class Parameter {
  uuid: string;
  manualInput = '';
  linkedParameterId: string = null;

  constructor(
    public name: string,
    public statletId: number,
    private statletManager: StatletManagerService,
  ) {
    this.uuid = UUID.UUID();
  }

  get value(): any {
    if (this.linkedParameterId) {
      return this.statletManager.getParameter(this.linkedParameterId).value;
    } else {
      return this.manualInput;
    }
  }

  set value(newValue: any) {
    this.manualInput = newValue;
  }

  linkTo(target: Parameter): void {
    target.linkedParameterId = this.uuid;
  }

  unlink(target: Parameter): void {
    target.linkedParameterId = null;
  }
}
