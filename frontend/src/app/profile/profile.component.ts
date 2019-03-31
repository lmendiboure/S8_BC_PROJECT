import { Component, OnInit } from '@angular/core';
import { AuthentificationService} from '../services/authentification.service'
import { User } from '../models/user'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: User;

  constructor(private authentificationService: AuthentificationService) { 
    this.authentificationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.getUser();
    console.log(this.getUser());
  }

  getUser(){
    return this.currentUser;
  }



}
