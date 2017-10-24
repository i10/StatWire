import { RemoteRService } from './remote-r.service';

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
        return remoteR.execute(secondFunction, argsObject)
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
    remoteR.execute(functionCode, {}, [{name: 'file', file: file}])
      .then(result => {
        expect(result.consoleOutput).toContain('fileContent');
      })
      .catch(fail)
      .then(done);
  });
});
