import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MessageService } from '../../shared/message.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private messageService: MessageService) {}

  clearMessages(): boolean {
    // To be called when navigating via menu to a new page to clear any old messages.
    // This won't be handled automatically in AppComponent as menu clicks with mat sidenav
    // are imperative and will not clear immediately as desired.
    this.messageService.clear();
    return true;
  }
}
