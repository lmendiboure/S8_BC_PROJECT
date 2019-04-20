import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { User } from '../models/user';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentUser: User;
  connected =true;
  id;


  constructor(private authentification: AuthentificationService) {
    this.authentification.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    if(localStorage.getItem('id')!=null){
      this.id = localStorage.getItem('id').split('"')[1];
    }
  }

  public logout(): void {
    this.authentification.logout();
    window.location.reload();   
  }

  public ifRoot(): Boolean {
    if (this.currentUser) {
      if (this.currentUser.pseudo == "admin" && this.currentUser.password == "admin") {
        return true;  
      }
      else {
        return false;
      }
    }
  }
}

