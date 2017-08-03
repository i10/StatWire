import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

declare const ocpu;

@Injectable()
export class RemoteRService {
  private opencpu = ocpu;

  constructor(private http: Http) {
    this.initializeOpenCPU();
  }

  private initializeOpenCPU(): void {
    this.opencpu.seturl('//localhost:5656/ocpu/library/statlets/R');
  }

  execute(code: string, args: Array<any>): Promise<{ returnValue: any, consoleOutput: string, graphicUrls: Array<string> }> {
    return new Promise((resolve, reject) => {
        const snippet = new this.opencpu.Snippet(code);
        const functionCallArgs = Object.assign({}, args, {func: snippet});  // TODO: Resolve naming conflict. Make params called 'func' possible.
        const req = this.opencpu.call(
          'functionCall',
          functionCallArgs,
          session => {
            const returnValuePromise = session.getObject()
              .fail(jqXHR => reject(jqXHR.responseText + '\n(Note: You currently cannot pass S3 objects in StatLets.)'));
            const consoleOutputPromise = session.getStdout();
            const graphics = this.getGraphics(session);
            Promise.all([returnValuePromise, consoleOutputPromise, graphics])
              .then(values => resolve({
                returnValue: values[0],
                consoleOutput: values[1],
                graphicUrls: values[2],
              }));
          },
        ).fail(() => {
          reject(req.responseText);
        });
      },
    );
  }

  private getGraphics(session): Promise<Array<string>> {
    return new Promise((resolve) => {
      const location = session.getLoc();
      this.http.get(location + 'graphics')
        .toPromise()
        .then(response => response.text().split('\n'))
        .then(namesArray => namesArray.filter(name => !(['last', ''].includes(name.trim()))))
        .then(namesArray => namesArray.map(name => location + 'graphics/' + name))
        .then(resolve);
    });
  }
}
