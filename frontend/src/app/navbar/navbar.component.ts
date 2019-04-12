import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentUser: User;
  connected =true;


  constructor(private authentification: AuthentificationService) {
    this.authentification.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  }

  public logout(): void {
    this.authentification.logout();
    window.location.reload();   
  }

  public ifRoot(): Boolean {
    if (this.currentUser) {
      if (this.currentUser.pseudo == "admin" && this.currentUser.password == "root" && this.currentUser.id == "0x000000") {
        console.log("Je suis là")
        return true;  
      }
      else {
        return false;
      }
    }
  }
}

