import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';


@Component({
  selector: 'app-information-about-user',
  templateUrl: './information-about-user.component.html',
  styleUrls: ['./information-about-user.component.scss']
})
export class InformationAboutUserComponent implements OnInit {

  userSearch;


  constructor(private http: HttpClient, private router: Router
    , private _route: ActivatedRoute,
    private authenticationService: AuthentificationService) {

  }


  ngOnInit() {
    var currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    var jsonInfo = JSON.parse(localStorage.getItem('currentUser'));
    var id = this._route.snapshot.queryParamMap.get('id');
    this.userSearch = this._route.snapshot.data['information'];
  }

}



