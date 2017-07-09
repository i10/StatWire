
import { UuidService } from './uuid.service';

describe('UuidService', () => {
  let uuidService: UuidService;
  beforeEach(() => {
    uuidService = new UuidService();
  });

  it('should generate 1000 unique UUIDs', () => {
    const allUuids = new Set();
    for (let i = 0; i < 1000; i++) {
      allUuids.add(uuidService.generate());
      expect(allUuids.size).toEqual(i + 1);
    }
  });
});
