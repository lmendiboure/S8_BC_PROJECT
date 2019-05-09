import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gestion-problemes',
  templateUrl: './gestion-problemes.component.html',
  styleUrls: ['./gestion-problemes.component.scss']
})
export class GestionProblemesComponent implements OnInit {

  signalements;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.signalements = this.route.snapshot.data['signalements'].response;
  }

  taskCompleted(idSignal: string){
    console.log(idSignal);
    return this.http.delete("http://localhost:3001/admin/reports/"+idSignal).subscribe(data=>{console.log(data)});
  }

}
