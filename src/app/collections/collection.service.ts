import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of, Subject, Subscription } from 'rxjs';
import { map, catchError, tap } from "rxjs/operators";
import { Collection, CollectionAdapter } from './collection';
import { CollectionInfo, CollectionInfoAdapter } from './collection-info';
import { MessageService } from '../shared/message.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { LocalStorageService } from '../shared/local-storage.service';
import { User } from '../auth/user';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  private DEFAULT_COLLECTION_KEY: string = 'PMDB_COLLECTION_SERVICE_DEFAULT_COLLECTION';
  private USER_KEY: string = 'PMDB_COLLECTION_SERVICE_USER';
  private SHARE_OFFERS_KEY: string = 'PMDB_COLLECTION_SERVICE_SHARE_OFFERS';

  private collectionsUrl: string;

  constructor(private http: HttpClient,
    private ciAdapter: CollectionInfoAdapter,
    private cAdapter: CollectionAdapter,
    private messageService: MessageService,
    private authService: AuthService,
    private localStorageService: LocalStorageService) {
    this.collectionsUrl = environment.servicesUrl + environment.collectionsPath;
    this.refreshCache();
  }

  private refreshCache(): boolean {
    let currentUser: User = this.authService.getUser();
    let cachedUser: string = this.localStorageService.get(this.USER_KEY, 'refreshCache');
    if (currentUser?.name != cachedUser) {
      console.log('clearing/refreshing collection service cache.');
      console.log('currentUser: ', currentUser);
      console.log('cached user name: ', cachedUser);
      this.localStorageService.remove(this.DEFAULT_COLLECTION_KEY);
      this.localStorageService.remove(this.SHARE_OFFERS_KEY);
      this.localStorageService.remove(this.USER_KEY);
      if (currentUser != null && currentUser != undefined) {
        console.log('!!! setting cached user to ' + currentUser.name);
        this.localStorageService.set(this.USER_KEY, currentUser.name);
        let cUser = this.localStorageService.get(this.USER_KEY, 'refreshCacheCheck');
        console.log('!!! double check cached user is ', cUser);
      } else {
        console.log('!!! NOT setting cached user; user does not exist');
      }
      return true;
    }
    return false;
  }

  private getDefaultMovieCollectionInternal(): Observable<CollectionInfo> {
    return this.http.get(this.collectionsUrl + 'default').pipe(
      map((item: any) => this.ciAdapter.adapt(item))
    );
  }

  getDefaultMovieCollection(): Observable<CollectionInfo> {
    // use cache for the default collection as it is needed frequently and doesn't change much
    this.refreshCache();
    let defaultCollectionInfo = this.localStorageService.get(this.DEFAULT_COLLECTION_KEY, 'getDefaultMovieCollection');
    if (defaultCollectionInfo === null || defaultCollectionInfo === undefined) {
      console.log('loading default movie collection from back end');
      return this.getDefaultMovieCollectionInternal().pipe(
        tap(collectionInfo => {
          this.localStorageService.set(this.DEFAULT_COLLECTION_KEY, collectionInfo)
        })
      )
    } else {
      console.log('using default movie collection from cache');
      return of(defaultCollectionInfo);
    }
  }

  getViewableMovieCollections(): Observable<CollectionInfo[]> {
    return this.http.get(this.collectionsUrl + 'viewable').pipe(
      map((data: any[]) => data.map((item) => this.ciAdapter.adapt(item)))
    );
  }

  getShareOfferMovieCollections(): Observable<CollectionInfo[]> {
    return this.http.get(this.collectionsUrl + 'shareOffers').pipe(
      map((data: any[]) => data.map((item) => this.ciAdapter.adapt(item)))
    );
  }

  getShareofferMovieCollectionsCount(): Observable<number> {
    // use cache for the share offer count as it doesn't change much
    this.refreshCache();
    let shareOfferCount: number = this.localStorageService.get(this.SHARE_OFFERS_KEY, 'getShareOfferMovieCollectionsCount');
    if (shareOfferCount === null || shareOfferCount === undefined) {
      console.log('loading share offer collections from back end to get share offer count');
      return this.getShareOfferMovieCollections().pipe(
        map(collectionInfos => collectionInfos.length),
        tap(count => {
          this.localStorageService.set(this.SHARE_OFFERS_KEY, count)
        })
      )
    } else {
      console.log('using share offers count from cache');
      return of(shareOfferCount);
    }
  }

  changeDefaultMovieCollection(collectionId: string): Observable<CollectionInfo> {
    return this.http.post(this.collectionsUrl + 'changeDefault', collectionId).pipe(
      map((item: any) => this.ciAdapter.adapt(item)),
      tap((collectionInfo: CollectionInfo) => {
        console.log('updating cached default collection');
        this.localStorageService.set(this.DEFAULT_COLLECTION_KEY, collectionInfo);
      }),
      catchError(error => this.messageService.error('Unable to change movie collections.', error))
    );
  }

  addMovieCollection(movieCollection: Collection): Observable<Collection> {
    return this.http.post(this.collectionsUrl + 'new', movieCollection).pipe(
      map((item: any) => this.cAdapter.adapt(item)),
      catchError(error => this.messageService.error('Movie collection could not be created.', error))
    );
  }

  deleteMovieCollection(movieCollectionId: string): Observable<any> {
    return this.http.post(this.collectionsUrl + 'delete', movieCollectionId).pipe(
      catchError(error => this.messageService.error('Movie collection could not be deleted.', error))
    );
  }

  acceptShareOffer(collectionId: string): Observable<any> {
    return this.http.post(this.collectionsUrl + 'acceptShareOffer', collectionId).pipe(
      tap(x => {
        let shareOfferCount: number = this.localStorageService.get(this.SHARE_OFFERS_KEY, 'acceptShareOffer');
        if (shareOfferCount != null && shareOfferCount != undefined) {
          shareOfferCount--;
          this.localStorageService.set(this.SHARE_OFFERS_KEY, shareOfferCount);
        }
      }),
      catchError(error => this.messageService.error('Share offer could not be accepted.', error))
    );
  }

  declineShareOffer(collectionId: string): Observable<any> {
    return this.http.post(this.collectionsUrl + 'declineShareOffer', collectionId).pipe(
      tap(x => {
        let shareOfferCount: number = this.localStorageService.get(this.SHARE_OFFERS_KEY, 'declineShareOffer');
        if (shareOfferCount != null && shareOfferCount != undefined) {
          shareOfferCount--;
          this.localStorageService.set(this.SHARE_OFFERS_KEY, shareOfferCount);
        }
      }),
      catchError(error => this.messageService.error('Share offer could not be declined.', error))
    );
  }

  revokeMyPermission(collectionId: string): Observable<any> {
    return this.http.post(this.collectionsUrl + 'revokeMyPermission', collectionId).pipe(
      catchError(error => this.messageService.error('Unable to remove the movie collection.', error))
    );
  }
}
