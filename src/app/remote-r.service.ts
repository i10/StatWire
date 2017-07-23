import { Injectable } from '@angular/core';
import { Parameter } from './model/parameter';

declare const ocpu;

@Injectable()
export class RemoteRService {
  private opencpu = ocpu;

  constructor() {
    this.initializeOpenCPU();
  }

  private initializeOpenCPU(): void {
    this.opencpu.seturl('//localhost:5656/ocpu/library/statlets/R');
  }

  execute(code: string, args: Array<Parameter>): Promise<{ returnValue: any, consoleOutput: string }> {
    return new Promise((resolve, reject) => {
        const snippet = new this.opencpu.Snippet(code);
        const openCpuArgs = this.convertParametersToOpenCpuArgs(args);
        const req = this.opencpu.call(
          'do.call',
          {
            what: snippet,
            args: openCpuArgs,
          },
          session => {
            const returnValuePromise = session.getObject();
            const consoleOutputPromise = session.getConsole();
            Promise.all([returnValuePromise, consoleOutputPromise])
              .then(values => resolve({returnValue: values[0], consoleOutput: values[1]}));
          },
        );
        req.fail(() => {
          reject(req.responseText);
        });
      },
    );
  }

  private convertParametersToOpenCpuArgs(parameterList: Array<Parameter>): any {
    const openCpuArgs = {};
    for (const parameter of parameterList) {
      openCpuArgs[parameter.name] = parameter.value;
    }
    return openCpuArgs;
  }
}
