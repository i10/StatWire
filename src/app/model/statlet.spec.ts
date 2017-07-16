import { Parameter } from './parameter';
import { Statlet } from './statlet';

describe('Statlet', () => {
  let statlet: Statlet;
  beforeEach(() => {
    statlet = new Statlet(
      0,
      null,
      null,
    );
  });

  it('#convertStatletsCodeToRCode should pack multiple return values into an R list', () => {
    const statletCode = 'function(){return(first, second, third)}';
    const actualRCode = statlet['convertStatletCodeToRCode'](statletCode);
    expect(actualRCode).toEqual('function(){return(list(first, second, third))}');
  });

  it('#updateOutputsFromRawValues should write the values to the parameters while keeping their links', () => {
    statlet.outputList
      .addParameter('first')
      .addParameter('second')
      .addParameter('third');

    const linkedParameter = new Parameter('linkToSecond');
    statlet.outputList.get(1).linkTo(linkedParameter);

    statlet['updateOutputsFromRawValues']([1, 2, 3]);
    expect(statlet.outputList.get(0).value).toEqual(1);
    expect(statlet.outputList.get(1).value).toEqual(2);
    expect(statlet.outputList.get(2).value).toEqual(3);
    expect(linkedParameter.value).toEqual(statlet.outputList.get(1).value);
  });

  describe('with remoteRStub', () => {
    const remoteRStub = {execute: function () {}};
    beforeEach(() => {
      statlet['remoteR'] = <any>remoteRStub;
    });

    it('#execute should write each one of multiple return values to the corresponding outputs', () => {
      spyOn(remoteRStub, 'execute').and.returnValue(new Promise((resolve) => {
        resolve({returnValue: [1, 2, 3], consoleOutput: ''});
      }));

      statlet.outputList
        .addParameter('first')
        .addParameter('second')
        .addParameter('third');

      statlet.execute()
        .then(() => {
          expect(remoteRStub.execute).toHaveBeenCalled();
          expect(statlet.outputList.get(0).value).toEqual(1);
          expect(statlet.outputList.get(1).value).toEqual(2);
          expect(statlet.outputList.get(2).value).toEqual(3);
        });
    });

    it('#execute should unpack collections to their respective output', () => {
      spyOn(remoteRStub, 'execute').and.returnValue(new Promise(resolve => {
        resolve({returnValue: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], consoleOutput: ''});
      }));

      statlet.outputList
        .addParameter('first')
        .addParameter('second')
        .addParameter('third');

      statlet.execute()
        .then(() => {
          expect(remoteRStub.execute).toHaveBeenCalled();
          expect(statlet.outputList.get(0).value).toEqual([1, 2, 3]);
          expect(statlet.outputList.get(1).value).toEqual([4, 5, 6]);
          expect(statlet.outputList.get(2).value).toEqual([7, 8, 9]);
        })
    });
  });
});

