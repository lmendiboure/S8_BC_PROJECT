import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { ActivatedRoute } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-manage-ti',
  templateUrl: './manage-ti.component.html',
  styleUrls: ['./manage-ti.component.scss']
})
export class ManageTIComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthentificationService,
  ) { }
  
  users: User[] = [];

  ngOnInit() {
    this.users = this.route.snapshot.data['users'];
  }

  increaseTrustIndex(bcAddress: string){
    this.authenticationService.increaseTI(bcAddress).
    subscribe(
      _=>{window.location.reload()}
    )
  }

  decreaseTrustIndex(bcAddress: string) {
    this.authenticationService.decreaseTI(bcAddress).
      subscribe(
        _ => { window.location.reload() }
      )
  }

}
