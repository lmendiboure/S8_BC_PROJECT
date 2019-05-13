import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-flux-entrant',
  templateUrl: './entrant.component.html',
  styleUrls: ['./entrant.component.css']
})
export class EntrantComponent implements OnInit {
  
  list_video=[]
  constructor(private http: HttpClient,) { }

  ngOnInit(){
    var url = 'http://localhost:2900/local_video_list/225.0.0.1'; // remplacer 225.0.0.1 par le nom du group dans la page
    console.log(url);
    this.http.get<any>(url,{observe:'response'}).subscribe(data=>{console.log(data);});
  }



}
