import { Injectable } from '@angular/core';
import { CodeSnippet, OpenCPU, Session } from 'opencpu-ts';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RemoteRService {
  private opencpu = new OpenCPU();
  static packageUrl = 'http://localhost:5656/ocpu/library/statlets';
  initializationPromise: Promise<URL>;

  constructor() {
    this.initializeOpenCPU();
  }

  async execute(code: string, normalArgs: object = {}, fileParameters: Array<{ name: string, file: File }> = []): Promise<ExecutionResult> {
    const codeSnippet = RemoteRService.createCodeSnippetOutOfString(code);
    const fileContainer = {};
    for (const fileParameter of fileParameters) {
      fileContainer[fileParameter.name] = fileParameter.file;
    }
    const functionCallArgs = Object.assign(
      {},
      {normalArgs: normalArgs},
      fileContainer,
      {argsToEvaluate: []},
      {func: codeSnippet},
    );  // TODO: Resolve naming conflict. Make params called 'func' and 'argsToEvaluate' possible.
    const session = await this.opencpu.call('functionCall', functionCallArgs);
    return ExecutionResult.createFromSession(session);
  }

  static createCodeSnippetOutOfString(statletCode: string): CodeSnippet {
    const returnStatementPattern = /return\(([^)]*)\)/;
    const rCode = statletCode.replace(returnStatementPattern, 'return(list($1))');
    return new CodeSnippet(rCode);
  }

  private initializeOpenCPU(): void {
    this.initializationPromise = this.opencpu.setUrl(RemoteRService.packageUrl);
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
