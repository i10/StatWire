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

  execute(code: string, args: ParameterList): Promise<any> {
    return new Promise((resolve, reject) => {
        const snippet = new this.opencpu.Snippet(code);
        const openCpuArgs = this.convertParameterListToOpenCpuArgs(args);
        const req = this.opencpu.rpc(
          'do.call',
          {
            what: snippet,
            args: openCpuArgs,
          },
          outputs => {
            resolve(outputs);
          },
        );
        req.fail(() => {
          reject();
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
