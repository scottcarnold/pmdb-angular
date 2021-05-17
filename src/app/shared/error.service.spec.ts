import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { CollectionService } from '../collections/collection.service';
import { ErrorService } from './error.service';
import { EMPTY, Subject } from 'rxjs';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(CollectionService, {
          getDefaultMovieCollection: () => EMPTY,
          getViewableMovieCollections: () => EMPTY
        })
      ]
    });
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
