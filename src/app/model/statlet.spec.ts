import { Parameter } from './parameter';
import { Statlet } from './statlet';
import { StatletManagerService } from './statlet-manager.service';

describe('Statlet', () => {
  let statlet: Statlet;
  beforeEach(() => {
    statlet = new Statlet(
      0,
      null,
      null,
      null
    );
  });

  it('#getUpdatedParameters should add new parameters', () => {
    const parameterNames = ['first', 'second', 'third'];
    const actual = statlet['getUpdatedParameters']([], parameterNames);
    expect(actual.map(parameter => parameter.name)).toEqual(parameterNames);
  });

  it('#getUpdatedParameters should remove parameters not present in new list', () => {
    const parameterNames = ['first', 'second', 'third'];
    const actual = statlet['getUpdatedParameters']([new Parameter('fourth')], parameterNames);
    expect(actual.map(parameter => parameter.name)).toEqual(parameterNames)
  });

  it('#getUpdatedParameters should keep original if parameter with same name exists', () => {
    const toKeep = new Parameter('keepMe');
    const actual = statlet['getUpdatedParameters']([toKeep], [toKeep.name]);
    expect(actual).toEqual([toKeep]);
    expect(actual[0]).toBe(toKeep);
  });

  it('#setInputsUsingNames should make the inputs match the supplied names', () => {
    const parameterNames = ['first', 'second', 'third'];
    statlet.setInputsUsingNames(parameterNames);
    expect(statlet.inputs.map(parameter => parameter.name)).toEqual(parameterNames);
  });

  it('#setOutputsUsingNames should make the outputs match the supplied names', () => {
    const parameterNames = ['first', 'second', 'third'];
    statlet.setOutputsUsingNames(parameterNames);
    expect(statlet.outputs.map(parameter => parameter.name)).toEqual(parameterNames);
  });

  describe('code execution', () => {
    it('#convertStatletsCodeToRCode should pack multiple return values into an R list', () => {
      const statletCode = 'function(){return(first, second, third)}';
      const actualRCode = statlet['convertStatletCodeToRCode'](statletCode);
      expect(actualRCode).toEqual('function(){return(list(first, second, third))}');
    });

    it('#updateOutputsFromRawValues should write the values to the parameters while keeping their links', () => {
      statlet.setOutputsUsingNames(['first', 'second', 'third']);

      let linkedParameter: Parameter;
      const statletManagerMock: StatletManagerService = {
        getParameter: id => statlet.outputs.concat([linkedParameter]).find(param => param.uuid === id),
      } as any;
      linkedParameter = new Parameter('linkToSecond');
      statlet.outputs[1].linkTo(linkedParameter);

      statlet['updateOutputsFromRawValues']([1, 2, 3]);
      expect(statlet.outputs.map(parameter => parameter.value)).toEqual([1, 2, 3]);
      expect(linkedParameter.value).toEqual(statlet.outputs[1].value);
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

        statlet.setOutputsUsingNames(['first', 'second', 'third']);

        statlet.execute()
          .then(() => {
            expect(remoteRStub.execute).toHaveBeenCalled();
            expect(statlet.outputs.map(parameter => parameter.value)).toEqual([1, 2, 3]);
          });
      });

      it('#execute should unpack collections to their respective output', () => {
        spyOn(remoteRStub, 'execute').and.returnValue(new Promise(resolve => {
          resolve({returnValue: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], consoleOutput: ''});
        }));

        statlet.setOutputsUsingNames(['first', 'second', 'third']);

        statlet.execute()
          .then(() => {
            expect(remoteRStub.execute).toHaveBeenCalled();
            expect(statlet.outputs.map(parameter => parameter.value)).toEqual(
              [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
              ]);
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

    it('#getInputNamesFromCode should parse valid inputs', () => {
      const testCode = (
        `function(first, second, third){
  return(first + second + third)
}`);
      const actualInputList = statlet['getInputNamesFromCode'](testCode);
      expect(actualInputList).toEqual(['first', 'second', 'third']);
    });

    it('#getInputNamesFromCode should return empty ParameterList when no inputs are given', () => {
      const testCode = (
        `function(){
  return(first, second, third)
}`);
      const actualInputList = statlet['getInputNamesFromCode'](testCode);
      expect(actualInputList).toEqual([]);
    });

    it('#getOutputNamesFromCode should parse valid outputs', () => {
      const testCode = (
        `function(ignoreMe){
  first <- 1
  second <- 'string'
  third <- ignoreMe + 1
  return(first, second, third)
}`);
      const actualOutputList = statlet['getOutputNamesFromCode'](testCode);
      expect(actualOutputList).toEqual(['first', 'second', 'third']);
    });

    it('#getOutputNamesFromCode should return empty ParameterList when no outputs are given', () => {
      const testCode = (
        `function(first, second, third){
  return()
}`);
      const actualOutputList = statlet['getOutputNamesFromCode'](testCode);
      expect(actualOutputList).toEqual([]);
    });
  });
});

