import { TestBed } from '@angular/core/testing';

import { GameResultsService } from './game-results.service';

describe('GameResultsService', () => {
  let service: GameResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
