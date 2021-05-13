import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MessageService } from '../../shared/message.service';
import { AuthService } from '../../auth/auth.service';
import { CollectionService } from '../../collections/collection.service';
import { User } from '../../auth/user';

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
  shareOffersCount: number = 0;

  constructor(private breakpointObserver: BreakpointObserver,
    private messageService: MessageService,
    private authService: AuthService,
    public collectionService: CollectionService) {  }

  ngOnInit() {
    this.collectionService.getShareofferMovieCollectionsCount().subscribe(count => this.shareOffersCount = count);
  }

  ngOnDestroy() {
  }

  clearMessages(): boolean {
    // To be called when navigating via menu to a new page to clear any old messages.
    // This won't be handled automatically in AppComponent as menu clicks with mat sidenav
    // are imperative and will not clear immediately as desired.
    this.messageService.clear();
    return true;
  }

  loggedIn(): boolean {
    return this.authService.isUserAuthenticated();
  }

  user(): User {
    return this.authService.getUser();
  }

  admin(): boolean {
    let user: User = this.authService.getUser();
    if (user === null || user === undefined) {
      return false;
    }
    return user.authorities?.includes('ROLE_ADMIN');
  }

  logout(): void {
    this.authService.logout();
  }
}
