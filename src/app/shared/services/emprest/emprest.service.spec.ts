import { TestBed } from '@angular/core/testing';

import { EmprestService } from './emprest.service';

describe('EmprestService', () => {
  let service: EmprestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmprestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
