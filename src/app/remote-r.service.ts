import { Injectable } from '@angular/core';
import { CodeSnippet, OpenCPU, Session } from 'opencpu-ts';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RemoteRService {
  private opencpu = new OpenCPU();

  constructor() {
    this.initializeOpenCPU();
  }

  static createCodeSnippetOutOfString(statletCode: string): CodeSnippet {
    const returnStatementPattern = /return\(([^)]*)\)/;
    const rCode = statletCode.replace(returnStatementPattern, 'return(list($1))');
    return new CodeSnippet(rCode);
  }

  private initializeOpenCPU(): void {
    this.opencpu.setUrl('http://localhost:5656/ocpu/library/statlets');
  }

  async execute(code: string, args: object): Promise<ExecutionResult> {
    const codeSnippet = RemoteRService.createCodeSnippetOutOfString(code);
    const functionCallArgs = Object.assign({}, args, {func: codeSnippet});  // TODO: Resolve naming conflict. Make params called 'func' possible.
    const session = await this.opencpu.call('functionCall', functionCallArgs);
    return ExecutionResult.createFromSession(session);
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
