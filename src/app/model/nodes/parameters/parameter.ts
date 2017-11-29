import { UUID } from 'angular2-uuid';

export abstract class Parameter {
  uuid: string;

  value: any;

  constructor(
    public name: string,
  ) {
    this.uuid = UUID.UUID();
  }
}
