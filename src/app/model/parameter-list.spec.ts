import { Parameter } from './parameter';
import { ParameterList } from './parameter-list';

describe('ParameterList', () => {
  let parameterList: ParameterList;
  beforeEach(() => {
    parameterList = new ParameterList();
    parameterList.addParameter('first')
      .addParameter('second')
      .addParameter('third');
  });

  it('#get should return the matching Parameter', () => {
    const names = ['first', 'second', 'third'];
    for (let i = 0; i < 3; i++) {
      const parameter = parameterList.get(i);
      expect(parameter.name).toEqual(names[i]);
    }
  });

  it('#get should return undefined when the index is invalid', () => {
    const result = parameterList.get(4);
    expect(result).toBeUndefined();
  });

  it("#print should produce a comma-separated list of its parameters' names", () => {
    const result = parameterList.print();
    expect(result).toEqual('first, second, third');
  });

  it('#count should return the amount of parameters in the list', () => {
    expect(parameterList.count()).toEqual(3);
    parameterList.addParameter('fourth');
    expect(parameterList.count()).toEqual(4);
  });

  it('#count should return 0 for empty list', () => {
    const emptyList = new ParameterList();
    expect(emptyList.count()).toEqual(0);
  });

  it('#hasParameterWithSameName returns true given present parameter', () => {
    const result = parameterList['hasParameterWithSameName'](new Parameter('second'));
    expect(result).toEqual(true);
  });

  it('#hasParameterWithSameName returns false given missing parameter', () => {
    const result = parameterList['hasParameterWithSameName'](new Parameter('missing'));
    expect(result).toEqual(false);
  });

  it('#updateWith should keep original if parameter with same name exists', () => {
    const originalList = new ParameterList();
    originalList.addParameter('first');
    const newList = new ParameterList();
    newList.addParameter('first');

    const originalFirst = originalList.get(0);
    originalList.updateWith(newList);
    expect(originalList.count()).toEqual(1);
    expect(originalList.get(0)).toBe(originalFirst);
  });

  it('#updateWith should add new parameters', () => {
    const originalList = new ParameterList();
    originalList.addParameter('first');
    const newList = new ParameterList();
    newList.addParameter('first')
      .addParameter('second');

    originalList.updateWith(newList);
    expect(originalList.count()).toEqual(2);
    expect(originalList.get(1)).toBe(newList.get(1));
  });

  it('#updateWith should remove parameters not present in new list', () => {
    const originalList = new ParameterList();
    originalList.addParameter('first');
    const toUpdate = new ParameterList();

    parameterList.updateWith(toUpdate);
    expect(parameterList.count()).toEqual(0);
  });
});
