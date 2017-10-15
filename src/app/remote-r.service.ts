import { Injectable } from '@angular/core';
import { OpenCPU, Session } from 'opencpu-ts';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RemoteRService {
  private opencpu = new OpenCPU();

  constructor() {
    this.initializeOpenCPU();
  }

  async execute(code: string, args: Array<any>): Promise<ExecutionResult> {
    const functionCallArgs = Object.assign({}, args, {func: code});  // TODO: Resolve naming conflict. Make params called 'func' possible.
    const session = await this.opencpu.call('functionCall', functionCallArgs);
    return ExecutionResult.createFromSession(session);
  }

  private initializeOpenCPU(): void {
    this.opencpu.setUrl('http://localhost:5656/ocpu/library/statlets');
  }

}

export class ExecutionResult {
  constructor(
    public returnValue: any,
    public consoleOutput: string,
    public graphicUrls: Array<string>,
  ) { }

  static async createFromSession(session: Session): Promise<ExecutionResult> {
    const returnValue = await session.getObject();
    const stdout = await session.get('stdout').then(response => response.text());
    const graphics = await this.getGraphics(session);
    return new ExecutionResult(
      returnValue,
      stdout,
      graphics,
    );
  }

  private static async getGraphics(session: Session): Promise<Array<string>> {
    return session.get('graphics')
      .then((response: Response) => response.text())
      .then(text => text.split('\n'))
      .then(namesArray => namesArray.filter(name => !(['last', ''].includes(name.trim()))))
      .then(namesArray => namesArray.map(name => location + 'graphics/' + name));
  }

}
