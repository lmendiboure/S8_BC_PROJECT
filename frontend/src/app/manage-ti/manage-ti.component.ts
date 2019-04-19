import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-ti',
  templateUrl: './manage-ti.component.html',
  styleUrls: ['./manage-ti.component.scss']
})
export class ManageTIComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) { }
  
  users: User[] = [];

  ngOnInit() {
    this.users = this.route.snapshot.data['users'];
    console.log(this.users);
  }

}
