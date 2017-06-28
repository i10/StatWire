import { Injectable } from '@angular/core';

declare const ocpu;

@Injectable()
export class RemoteR {
  private opencpu = ocpu;

  constructor() {
    this.initializeOpenCPU();
  }

  private initializeOpenCPU(): void {
    this.opencpu.seturl('//localhost:5656/ocpu/library/statlets/R')
  }
}
