import { UuidService } from './uuid.service';

describe('UuidService', () => {
  let uuidService: UuidService;
  beforeEach(() => {
    uuidService = new UuidService();
  });

  it('should generate 100 unique UUIDs', () => {
    const allUuids = new Set();
    for (let i = 0; i < 100; i++) {
      allUuids.add(uuidService.generate());
      expect(allUuids.size).toEqual(i + 1);
    }
  });
});
