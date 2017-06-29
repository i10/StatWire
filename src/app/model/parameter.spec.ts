import { Parameter } from './parameter';

describe('Parameter', () => {
  it("#linkTo should update the target's value upon source's value change", () => {
    const source = new Parameter('source');
    const target = new Parameter('target');
    source.linkTo(target);
    source.value = 1;
    expect(target.value).toEqual(1);
  });

  it("#linkTo should overwrite the target's value with the source's", () => {
    const source = new Parameter('source');
    source.value = 1;
    const target = new Parameter('target');
    target.value = 2;
    source.linkTo(target);
    expect(target.value).toEqual(1);
  })
});
