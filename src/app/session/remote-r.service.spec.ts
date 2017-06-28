import { TestBed, inject } from '@angular/core/testing';

import { RemoteR } from './remote-r.service';

describe('RemoteR', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoteR]
    });
  });

  it('should be created', inject([RemoteR], (service: RemoteR) => {
    expect(service).toBeTruthy();
  }));
});
