import { TestBed, inject } from '@angular/core/testing';

import { PlumbingService } from './plumbing.service';

describe('PlumbingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlumbingService]
    });
  });

  it('should be created', inject([PlumbingService], (service: PlumbingService) => {
    expect(service).toBeTruthy();
  }));
});
