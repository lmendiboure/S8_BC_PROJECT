import { Component, OnInit } from '@angular/core';
import{ AuthentificationService} from '../services/authentification.service';
import { User } from '../models/user';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser: User;

  constructor(private authentification: AuthentificationService) {
    this.authentification.currentUser.subscribe(x => this.currentUser = x);
   }

  ngOnInit() {
  }

  public logout(): void{
    this.authentification.logout();
  }

}

