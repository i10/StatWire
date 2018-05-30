import { InputParameter } from './inputParameter';
import { OutputParameter } from './outputParameter';

describe('InputParameter', () => {
  let source: OutputParameter, target: InputParameter;
  beforeEach(() => {
    source = new OutputParameter('source');
    target = new InputParameter('target');
  });

  it("#linkTo should update the target's value upon source's value change", () => {
    target.linkTo(source);
    source.value = 1;
    expect(target.value).toEqual(1);
  });

  it("#linkTo should overwrite the target's value with the source's", () => {
    source.value = 1;
    target.value = 2;
    target.linkTo(source);
    expect(target.value).toEqual(1);
  });

  it('#unlink should stop updates from the source', () => {
    target.linkTo(source);
    source.value = 2;
    expect(target.value).toEqual(2);
    target.unlink();
    source.value = 3;
    expect(target.value).toEqual('');
  });
});
