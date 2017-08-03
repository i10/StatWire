import { Injectable } from '@angular/core';
import { Statlet } from './statlet';

@Injectable()
export class NodePool {
  statletList: Array<Statlet> = [];

  constructor(
  ) {
    this.statletList = sessionStorage.pop(); // This is ideal
  }

}
