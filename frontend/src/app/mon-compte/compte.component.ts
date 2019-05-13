import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-mon-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.scss']
})
export class CompteComponent implements OnInit {

  dateVal = new Date().toLocaleString();
  token: string;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthentificationService,
  ) { }

  ngOnInit() {
    this.token = JSON.parse(localStorage.getItem('currentUser')).token;
  }

  doReporting() {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Suivant  &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([
      {
        title: 'Titre de votre plainte',
      },
      'Décrivez le problème !',
    ]).then((result) => {
      {
          var title = result.value[0];
          var description = result.value[1];
          var id = localStorage.getItem('id').split('"')[1];
          this.authenticationService.doReporting(title, description, this.dateVal, this.token, id).
            subscribe(_ => Swal.fire({
              title: 'Signalement effectué',
              html:
                'Titre de votre plainte: ' + result.value[0]
                + '<br>' +
                'Description: ' + result.value[1],
              confirmButtonText: 'Ok'
            }));
      }
    })
  }
}
  
      
