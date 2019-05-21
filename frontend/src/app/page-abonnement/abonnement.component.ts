import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.component.html',
  styleUrls: ['./abonnement.component.css']
})
export class AbonnementComponent implements OnInit {

  public fluxDispo: string[] = ['Windstorm', 'Bombasto', 'Magneta', 'Tornado'];
  public mySubs: string[] = ['aymanlebg1', 'aymanlebg2', 'aymanlebg3'];
  public listGroups;
  public userIP;
  public usersGroup;


  constructor(private http: HttpClient,
    private authentificationService: AuthentificationService) {
  }

  ngOnInit() {
    this.authentificationService.getListGroup()
      .subscribe(
        data => {
          localStorage.setItem('listGroups', JSON.stringify(data.response));
        }
      );

    this.listGroups = JSON.parse(localStorage.getItem('listGroups'));
    this.userIP = localStorage.getItem('ip').split('"')[0];
    console.log(this.userIP);
    this.authentificationService.findGroupOfUser(this.userIP).subscribe(
      data => {
        console.log(data);
        //localStorage.setItem('usersGroup',JSON.stringify(data.responce));
      }
    );
    this.usersGroup = JSON.parse(localStorage.getItem('usersGroup'));
    console.log(this.usersGroup);


  }



}
