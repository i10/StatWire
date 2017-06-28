import { TestBed, inject } from '@angular/core/testing';

import { RemoteRService } from './remote-r.service';

describe('RemoteRService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoteRService]
    });
  });

  it('should be created', inject([RemoteRService], (service: RemoteRService) => {
    expect(service).toBeTruthy();
  }));
});
