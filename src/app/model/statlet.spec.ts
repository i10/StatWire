import { Parameter } from './parameter';
import { Statlet } from './statlet';
import { ParameterList } from './parameter-list';

describe('Statlet', () => {
  let statlet: Statlet;
  beforeEach(() => {
    statlet = new Statlet(
      0,
      null,
      null,
    );
  });

  describe('code execution', () => {
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
          });
      });
    });
  });

  describe('parameter update', () => {
    it('#parseParameters should return empty array if no parameters are found', () => {
      const testCode = 'function()';
      const actualParameterNames = statlet['parseParameters'](testCode, /function\(([^)]*?)\)/);
      expect(actualParameterNames).toEqual([]);
    });

    it('#getInputList should parse valid inputs', () => {
      const testCode = (
`function(first, second, third){
  return(first + second + third)
}`);
      const actualInputList = statlet['getInputList'](testCode);
      const expectedInputList = new ParameterList();
      expectedInputList.addParameter('first')
        .addParameter('second')
        .addParameter('third');
      removeIds(actualInputList);
      removeIds(expectedInputList);
      expect(actualInputList).toEqual(expectedInputList);
    });

    function removeIds(list: ParameterList): void {
      for (const parameter of list) {
        delete parameter.uuid;
      }
    }

    it('#getInputList should return empty ParameterList when no inputs are given', () => {
      const testCode = (
`function(){
  return(first, second, third)
}`);
      const actualInputList = statlet['getInputList'](testCode);
      const expectedInputList = new ParameterList();
      expect(actualInputList).toEqual(expectedInputList);
    });

    it('#getOutputList should parse valid outputs', () => {
      const testCode = (
`function(ignoreMe){
  first <- 1
  second <- 'string'
  third <- ignoreMe + 1
  return(first, second, third)
}`);
      const actualOutputList = statlet['getOutputList'](testCode);
      const expectedOutputList = new ParameterList();
      expectedOutputList.addParameter('first')
        .addParameter('second')
        .addParameter('third');
      removeIds(actualOutputList);
      removeIds(expectedOutputList);
      expect(actualOutputList).toEqual(expectedOutputList);
    });

    it('#getOutputList should return empty ParameterList when no outputs are given', () => {
      const testCode = (
`function(first, second, third){
  return()
}`);
      const actualOutputList = statlet['getOutputList'](testCode);
      const expectedOutputList = new ParameterList();
      expect(actualOutputList).toEqual(expectedOutputList);
    });
  });
});

