import { CanvasPosition } from './canvas-position';
import { StatletManagerService } from './statlet-manager.service';

describe('StatletManagerService', () => {
  let statletManager: StatletManagerService;
  beforeEach(() => {
    statletManager = new StatletManagerService();
  });

  it('#createStatlet should save a Statlet when one is created', () => {
    const statlet = statletManager.createStatlet(
      'saveMe',
      new CanvasPosition(10, 10),
    );
    const allStatlets = statletManager.getAllStatlets();
    expect(allStatlets).toContain(statlet);
  });

  it('#getStatlet should return undefined when no matching Statlet is found', () => {
    const result = statletManager.getStatlet(1);
    expect(result).toBeUndefined();
  });

  describe('with added statlets', () => {
    let statlet1, statlet2;
    beforeEach(() => {
      statlet1 = statletManager.createStatlet(
        'first',
        new CanvasPosition(10, 10),
      );
      statlet2 = statletManager.createStatlet(
        'second',
        new CanvasPosition(10, 100),
      );
    });

    it('#createStatlet should assign different ids to two created Statlets', () => {
      expect(statlet1.id).not.toEqual(statlet2.id);
    });

    it('should retrieve all created nodes', () => {
      const allStatlets = statletManager.getAllStatlets();
      expect(allStatlets).toEqual([statlet1, statlet2]);
    });

    it('#getStatlet should return the Statlet with the right id', () => {
      const actual1 = statletManager.getStatlet(statlet1.id);
      expect(actual1).toBe(statlet1);
      const actual2 = statletManager.getStatlet(statlet2.id);
      expect(actual2).toBe(statlet2);
    });
  });
});
