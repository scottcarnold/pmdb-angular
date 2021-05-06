import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, catchError, tap } from "rxjs/operators";
import { Collection, CollectionAdapter } from './collection';
import { CollectionInfo, CollectionInfoAdapter } from './collection-info';
import { MessageService } from '../shared/message.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  private collectionsUrl: string;
  private shareOffers: number;
  private user$: Subscription;

  defaultCollectionChangeEvent: Subject<CollectionInfo>;
  shareOffersChangeEvent: Subject<number>;

  constructor(private http: HttpClient,
    private ciAdapter: CollectionInfoAdapter,
    private cAdapter: CollectionAdapter,
    private messageService: MessageService,
    private authService: AuthService) {
    this.collectionsUrl = environment.servicesUrl + environment.collectionsPath;
    this.defaultCollectionChangeEvent = new Subject<CollectionInfo>();
    this.shareOffersChangeEvent = new Subject<number>();
    this.user$ = this.authService.userEvent.subscribe(user => {
      if (user != null && user != undefined) {
        this.getShareOfferMovieCollections().subscribe(collectionInfos => {
          this.shareOffers = collectionInfos.length;
          this.shareOffersChangeEvent.next(this.shareOffers);
        })
      }
    });
  }

  getDefaultMovieCollection(): Observable<CollectionInfo> {
    return this.http.get(this.collectionsUrl + 'default').pipe(
      map((item: any) => this.ciAdapter.adapt(item))
    );
  }

  getViewableMovieCollections(): Observable<CollectionInfo[]> {
    return this.http.get(this.collectionsUrl + 'viewable').pipe(
      map((data: any[]) => data.map((item) => this.ciAdapter.adapt(item)))
    );
  }

  getShareOfferMovieCollections(): Observable<CollectionInfo[]> {
    return this.http.get(this.collectionsUrl + 'shareOffers').pipe(
      map((data: any[]) => data.map((item) => this.ciAdapter.adapt(item))),
      tap((collectionInfos: CollectionInfo[]) => {
        this.shareOffers = collectionInfos.length;
        this.shareOffersChangeEvent.next(this.shareOffers);
      })
    );
  }

  changeDefaultMovieCollection(collectionId: string): Observable<CollectionInfo> {
    return this.http.post(this.collectionsUrl + 'changeDefault', collectionId).pipe(
      map((item: any) => this.ciAdapter.adapt(item)),
      tap((collectionInfo: CollectionInfo) => this.defaultCollectionChangeEvent.next(collectionInfo)),
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
        this.shareOffers--;
        this.shareOffersChangeEvent.next(this.shareOffers);
      }),
      catchError(error => this.messageService.error('Share offer could not be accepted.', error))
    );
  }

  declineShareOffer(collectionId: string): Observable<any> {
    return this.http.post(this.collectionsUrl + 'declineShareOffer', collectionId).pipe(
      tap(x => {
        this.shareOffers--;
        this.shareOffersChangeEvent.next(this.shareOffers);
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
