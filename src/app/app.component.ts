import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MessageService } from './shared/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pmdb-angular';

  constructor(private router: Router, private messageService: MessageService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      console.log('Navigation start check; navigationTrigger is ' + event.navigationTrigger);
      // clear out any old app messages to user whenever they navigate to a new route
      if (event.navigationTrigger === 'imperative') {
        console.log('Navigation is imperative');
        // for imperative, keep the message for 1 navigation, as it needs to be shown AFTER following the route
        this.messageService.clearOnNav(1);
      } else {
        console.log('Navigation is NOT imperative');
        this.messageService.clear();
      }
    });
  }
}
