import { TestBed, inject } from '@angular/core/testing';

import { StatletManagerService } from './statlet-manager.service';

describe('StatletManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatletManagerService]
    });
  });

  it('should be created', inject([StatletManagerService], (service: StatletManagerService) => {
    expect(service).toBeTruthy();
  }));
});
