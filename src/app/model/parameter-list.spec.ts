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
});
