import { FileArgument, RemoteRService } from './remote-r.service';

xdescribe('RemoteRService OpenCPU integration', () => {
  let remoteR: RemoteRService;
  beforeEach((done) => {
    remoteR = new RemoteRService();
    remoteR.initializationPromise.then(done);
  });

  it('should be able to contact the OpenCPU server', (done) => {
    fetch(RemoteRService.packageUrl, {headers: {'Cache-Control': 'no-cache'}})
      .then(response => {
        if (response.ok) {
          return;
        } else {
          throw new TypeError(`Expected response code to be ok, was ${response.status}.`);
        }
      })
      .catch(fail)
      .then(done);
  });

  it('should get same print statement when passing summary object', (done) => {
    const firstFunction = 'function() {\n  data = data.frame(x=c(1,2),y=c(3,4))\n'
      + '  data$y = factor(data$y)\n  print(summary(data))\n	return(data)\n}';
    const secondFunction = `function(data) {\n  print(summary(data))\n  return()\n}`;
    remoteR.execute(firstFunction)
      .then(firstResult => {
        const data = firstResult.returnValue[0];
        const argsObject = {data: data};
        return remoteR.execute(secondFunction, undefined, undefined, argsObject)
          .then(secondResult => {
            expect(firstResult.consoleOutput).toEqual(secondResult.consoleOutput);
          });
      })
      .catch(fail)
      .then(done);
  });

  it('should be able to process uploaded files', (done) => {
    const file = new File(['fileContent'], 'file.txt');
    const functionCode = 'function(file) { content <- readLines(file); print(content); return(); }';
    remoteR.execute(functionCode, undefined, [new FileArgument('file', file)], undefined)
      .then(result => {
        expect(result.consoleOutput).toEqual(sanitizeNewLines('[1] "fileContent"\n'));
      })
      .catch(fail)
      .then(done);
  });

  it('should pass arguments to the correct parameter', (done) => {
    const functionCode1 = 'function(text2, file2, text1, file1, text3) {'
      + 'print(text2); print(readLines(file2)); print(text1); print(readLines(file1)); print(text3);' +
      ' return(text2, file2); }';
    const argsToEvaluate = {
      text1: '"first"',
      text2: '"second"',
      text3: '"third"',
    };
    const fileArgs = [
      new FileArgument('file1', new File(['firstFile'], 'file1.txt')),
      new FileArgument('file2', new File(['secondFile'], 'file2.txt')),
    ];
    remoteR.execute(functionCode1, argsToEvaluate, fileArgs)
      .then(result => {
        expect(result.consoleOutput).toEqual(sanitizeNewLines(
          '[1] "second"\n' +
          '\n[1] "secondFile"\n' +
          '[1] "first"\n' +
          '\n[1] "firstFile"\n' +
          '[1] "third"\n',
        ));
        return result.returnValue;
      })
      .then(returnValue => {
        const functionCode2 = 'function(text2, file3, text4) { print(text2); print(readLines(file3));' +
          ' print(text4); return(); }';
        const serializedArgs = {
          text2: returnValue[0],
        };
        const argsToEvaluate2 = {
          text4: '"fourth"',
        };
        const fileArgs2 = [
          new FileArgument('file3', new File(['thirdFile'], 'file3.txt')),
        ];
        return remoteR.execute(functionCode2, argsToEvaluate2, fileArgs2, serializedArgs);
      })
      .then(result => {
        expect(result.consoleOutput).toEqual(sanitizeNewLines(
          '[1] "second"\n' +
          '\n[1] "thirdFile"\n' +
          '[1] "fourth"\n',
        ));
      })
      .catch(fail)
      .then(done);
  });
});

function sanitizeNewLines(text: string): string {
  return text.replace(/\n/g, '\u000D\n');
}
