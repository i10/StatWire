import { Parameter } from './parameter';
import { StatletManagerService } from './statlet-manager.service';

describe('Parameter', () => {
  let source: Parameter, target: Parameter;
  let statletManagerMock: StatletManagerService;
  beforeEach(() => {
    statletManagerMock = {
      getParameter: id => [source, target].find(param => param.uuid === id)
    } as StatletManagerService;

    source = new Parameter('source');
    target = new Parameter('target');
  });

  it("#linkTo should update the target's value upon source's value change", () => {
    source.linkTo(target);
    source.value = 1;
    expect(target.value).toEqual(1);
  });

  it("#linkTo should overwrite the target's value with the source's", () => {
    source.value = 1;
    target.value = 2;
    source.linkTo(target);
    expect(target.value).toEqual(1);
  });

  it('#unlink should stop updates from the source', () => {
    source.linkTo(target);
    source.value = 2;
    expect(target.value).toEqual(2);
    source.unlink(target);
    source.value = 3;
    expect(target.value).toEqual('');
  });
});
