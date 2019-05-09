import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentUser;
  connected = true;
  id;
  token;
  boolAdmin;


  constructor(private authentification: AuthentificationService) {
    this.authentification.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    if (localStorage.getItem('id') != null) {
      this.id = localStorage.getItem('id').split('"')[1];
    }
    this.boolAdmin = localStorage.getItem('isAdmin');
  }

  public logout(): void {
    this.authentification.logout();
    window.location.reload();
  }

  public ifRoot(): Boolean {
    if (this.boolAdmin === "true") {
      return true;
    }
    else {
      return false;
    }
  }
}

