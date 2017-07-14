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

  it('#convertStatletsCodeToRCode should pack multiple return values into an R vector', () => {
    const statletCode = 'function(){return(first, second, third)}';
    const actualRCode = statlet['convertStatletCodeToRCode'](statletCode);
    expect(actualRCode).toEqual('function(){return(c(first, second, third))}');
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

  it('#execute should write a multiple return to each of the outputs', () => {
    const remoteRStub = {execute: function () {}};
    spyOn(remoteRStub, 'execute').and.returnValue(new Promise((resolve) => {
      resolve({returnValue: [1, 2, 3], consoleOutput: ''});
    }));
    statlet['remoteR'] = <any>remoteRStub;

    statlet.outputList
      .addParameter('first')
      .addParameter('second')
      .addParameter('third');
    statlet.code = 'function(){return(first, second, third)}';

    statlet.execute()
      .then(() => {
        expect(remoteRStub.execute).toHaveBeenCalledWith('function(){return(c(first, second, third))}', statlet.inputList);
        expect(statlet.outputList.get(0).value).toEqual(1);
        expect(statlet.outputList.get(1).value).toEqual(2);
        expect(statlet.outputList.get(2).value).toEqual(3);
      });
  });
});

