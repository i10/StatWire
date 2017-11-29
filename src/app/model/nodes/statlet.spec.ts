import { RemoteRService, Return } from '../../remote-r.service';
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

  it('#setInputsUsingNames should add new parameters', () => {
    const parameterNames = ['first', 'second', 'third'];
    statlet.setInputsUsingNames(parameterNames);
    expect(statlet.inputs.map(parameter => parameter.name)).toEqual(parameterNames);
  });

  it('#setInputUsingNames should remove parameters not present in new list', () => {
    const parameterNames = ['first', 'second', 'third'];
    statlet.inputs = [new Parameter('fourth')];
    statlet.setInputsUsingNames(parameterNames);
    expect(statlet.inputs.map(parameter => parameter.name)).toEqual(parameterNames);
  });

  it('#setInputUsingNames should keep original if parameter with same name exists', () => {
    const toKeep = new Parameter('keepMe');
    statlet.inputs = [toKeep];
    statlet.setInputsUsingNames([toKeep.name]);
    expect(statlet.inputs).toEqual([toKeep]);
    expect(statlet.inputs[0]).toBe(toKeep);
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
    const remoteRStub = new RemoteRService();
    beforeEach(() => {
      statlet['remoteR'] = remoteRStub;
    });

    it('#execute should write the values to the parameters while keeping their links', (done) => {
      const returnValue = {
        returns: [new Return(1, '1'), new Return(2, '2'), new Return(3, '3')],
        consoleOutput: '',
      };
      spyOn(remoteRStub, 'execute').and.returnValue(Promise.resolve(returnValue));

      statlet.setOutputsUsingNames(['first', 'second', 'third']);

      const linkedParameter = new Parameter('linkToSecond');
      statlet.outputs[1].linkTo(linkedParameter);

      statlet.execute()
        .then(() => {
          expect(statlet.outputs.map(parameter => parameter.value)).toEqual([1, 2, 3]);
          expect(linkedParameter.value).toEqual(statlet.outputs[1].value);
        })
        .catch(fail)
        .then(done);
    });

    it('#execute should write each one of multiple return values to the corresponding outputs', (done) => {
      const returnValue = {
        returns: [new Return(1, '1'), new Return(2, '2'), new Return(3, '3')],
        consoleOutput: '',
      };
      spyOn(remoteRStub, 'execute').and.returnValue(Promise.resolve(returnValue));

      statlet.setOutputsUsingNames(['first', 'second', 'third']);

      statlet.execute()
        .then(() => {
          expect(remoteRStub.execute).toHaveBeenCalled();
          expect(statlet.outputs.map(parameter => parameter.value)).toEqual([1, 2, 3]);
        })
        .catch(fail)
        .then(done);
    });

    it('#execute should unpack collections to their respective output', (done) => {
      const returnValue = {
        returns: [
          new Return([1, 2, 3], '1 2 3'),
          new Return([4, 5, 6], '4 5 6'),
          new Return([7, 8, 9], '7 8 9'),
        ],
        consoleOutput: '',
      };
      spyOn(remoteRStub, 'execute').and.returnValue(Promise.resolve(returnValue));

      statlet.setOutputsUsingNames(['first', 'second', 'third']);

      statlet.execute()
        .then(() => {
          expect(remoteRStub.execute).toHaveBeenCalled();
          expect(statlet.outputs.map(parameter => parameter.value)).toEqual(
            [
              [1, 2, 3],
              [4, 5, 6],
              [7, 8, 9],
            ]);
        })
        .catch(fail)
        .then(done);
    });
  });

  describe('parameter update', () => {
    it('#synchronizeParametersWithCode should return empty array if no parameters are found', () => {
      statlet.code = 'function()';
      statlet.synchronizeParametersWithCode();
      expect(statlet.inputs).toEqual([]);
    });

    it('#synchronizeParametersWithCode should parse valid inputs', () => {
      statlet.code = (
        `function(first, second, third){
  return(first + second + third)
}`);
      statlet.synchronizeParametersWithCode();
      expect(statlet.inputs.map(parameter => parameter.name)).toEqual(['first', 'second', 'third']);
    });

    it('#synchronizeParametersWithCode should return empty ParameterList when no inputs are given', () => {
      statlet.code = (
        `function(){
  return(first, second, third)
}`);
      statlet.synchronizeParametersWithCode();
      expect(statlet.inputs).toEqual([]);
    });

    it('#synchronizeParametersWithCode should parse valid outputs', () => {
      statlet.code = (
        `function(ignoreMe){
  first <- 1
  second <- 'string'
  third <- ignoreMe + 1
  return(first, second, third)
}`);
      statlet.synchronizeParametersWithCode();
      expect(statlet.outputs.map(parameter => parameter.name)).toEqual(['first', 'second', 'third']);
    });

    it('#synchronizeParametersWithCode should return empty ParameterList when no outputs are given', () => {
      statlet.code = (
        `function(first, second, third){
  return()
}`);
      statlet.synchronizeParametersWithCode();
      expect(statlet.outputs).toEqual([]);
    });
  });
});

