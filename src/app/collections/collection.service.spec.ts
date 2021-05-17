import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionService } from './collection.service';
import { MockProvider } from 'ng-mocks';
import { AuthService } from '../auth/auth.service';
import { LocalStorageService } from '../shared/local-storage.service';

describe('CollectionService', () => {
  let service: CollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        MockProvider(AuthService),
        MockProvider(LocalStorageService)
      ]
    });
    service = TestBed.inject(CollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
