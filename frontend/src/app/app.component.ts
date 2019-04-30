import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from './services/authentification.service';
import { User } from './models/user';
import { DemoService } from './services/demo.service';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IOV BLOCKCHAIN S8';
  currentUser: User;
  public users;

  constructor(
    private router: Router,
    private demoService: DemoService,
    private authenticationService: AuthentificationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
  }
}
