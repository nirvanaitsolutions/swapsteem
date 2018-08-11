import { TestBed, inject } from '@angular/core/testing';

import { AdverstisementService } from './adverstisement.service';

describe('AdverstisementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdverstisementService]
    });
  });

  it('should be created', inject([AdverstisementService], (service: AdverstisementService) => {
    expect(service).toBeTruthy();
  }));
});
