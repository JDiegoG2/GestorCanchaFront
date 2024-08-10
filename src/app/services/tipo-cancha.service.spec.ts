import { TestBed } from '@angular/core/testing';

import { TipoCanchaService } from './tipo-cancha.service';

describe('TipoCanchaService', () => {
  let service: TipoCanchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoCanchaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
