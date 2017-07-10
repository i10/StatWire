import { Injectable } from '@angular/core';
import { ParameterList } from './model/parameter-list';

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

  execute(code: string, args: ParameterList): Promise<{returnValue: any, consoleOutput: string}> {
    return new Promise((resolve, reject) => {
        const snippet = new this.opencpu.Snippet(code);
        const openCpuArgs = this.convertParameterListToOpenCpuArgs(args);
        const req = this.opencpu.call(
          'do.call',
          {
            what: snippet,
            args: openCpuArgs,
          },
          session => {
            let returnValue, consoleOutput;
            session.getObject().done(newReturnValue => {
              returnValue = newReturnValue;
              return session.getConsole();
            }).done(newConsoleOutput => {
              consoleOutput = newConsoleOutput;
              resolve({returnValue: returnValue, consoleOutput: consoleOutput});
            });
          },
        );
        req.fail(() => {
          reject(req.responseText);
        });
      },
    );
  }

  private convertParameterListToOpenCpuArgs(parameterList: ParameterList): any {
    const openCpuArgs = {};
    for (const parameter of parameterList) {
      openCpuArgs[parameter.name] = parameter.value;
    }
    return openCpuArgs;
  }
}
