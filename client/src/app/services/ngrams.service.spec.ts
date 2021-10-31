import { TestBed } from '@angular/core/testing';

import { NgramsService } from './ngrams.service';

describe('NgramsService', () => {
  let service: NgramsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgramsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
