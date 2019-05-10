import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-problemes',
  templateUrl: './gestion-problemes.component.html',
  styleUrls: ['./gestion-problemes.component.scss']
})
export class GestionProblemesComponent implements OnInit {

  signalements;
  boolSignal=false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.signalements = this.route.snapshot.data['signalements'].response;
    if(this.signalements.length===0){
      this.boolSignal=true
    }
  }

  taskCompleted(idSignal: string){
    return this.http.delete("http://localhost:3001/admin/reports/"+idSignal).
    subscribe(_=>{

      Swal.fire(
        'Suppression effectuée !',
        '',
        'success'
      ).then(function () {
        window.location.reload();
      })
    },
      error => {
        Swal.fire({
          type: 'error',
          title: "Erreur lors de la suppression",
          text: error,
        }).then(function () {
          window.location.reload();
        });
    });
  }

}
