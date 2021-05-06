import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MessageService } from '../../shared/message.service';
import { AuthService } from '../../auth/auth.service';
import { CollectionService } from '../../collections/collection.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  username: string = '';
  loggedIn: boolean = false;
  admin: boolean = false;
  user$: Subscription;
  shareOffers$: Subscription;
  shareOffers: number;

  constructor(private breakpointObserver: BreakpointObserver,
    private messageService: MessageService,
    private authService: AuthService,
    public collectionService: CollectionService) {  }

  ngOnInit() {
    this.user$ = this.authService.userEvent.subscribe(user => {
      if (user === null || user === undefined) {
        this.username = '';
        this.loggedIn = false;
        this.admin = false;
      } else {
        this.username = user.name;
        this.loggedIn = true;
        this.admin = user.authorities?.includes('ROLE_ADMIN');
      }
    });
    this.shareOffers$ = this.collectionService.shareOffersChangeEvent.subscribe(offerCount => {
      this.shareOffers = offerCount;
    });
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
    this.shareOffers$.unsubscribe();
  }

  clearMessages(): boolean {
    // To be called when navigating via menu to a new page to clear any old messages.
    // This won't be handled automatically in AppComponent as menu clicks with mat sidenav
    // are imperative and will not clear immediately as desired.
    this.messageService.clear();
    return true;
  }

  logout(): void {
    this.authService.logout();
  }
}
