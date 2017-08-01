import { Injectable } from '@angular/core';
import { Statlet } from './model/statlet';

@Injectable()
export class SessionStorageService {
  private currentStatlets: Array<Statlet> = [];

  constructor() {
  }

  update(currentStatlets: Array<Statlet>): void {
    this.set('currentStatlets', currentStatlets);
  }

  pop(): Array<Statlet> {
    this.currentStatlets = this.get('currentStatlets');

    return this.currentStatlets;
  }

  private set(name: string, object: Array<Statlet>): void {
    sessionStorage.setItem(name, this.stringify(object));
  }

  private stringify(object: Array<Statlet>): string {
    return JSON.stringify(object);
  }

  private get(name: string): Array<Statlet> {
    return this.parseToJSON(sessionStorage.getItem(name));
  }

  private parseToJSON(JSONAsString: string): Array<Statlet> {
    return JSON.parse(JSONAsString);
  }
}
