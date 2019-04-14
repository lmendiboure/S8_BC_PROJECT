import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse ,HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';   
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';  
import { User } from '../models/user';
import { Router, ActivatedRoute} from '@angular/router';
import { HttpParamsOptions } from '@angular/common/http/src/params';


@Component({
  selector: 'app-information-about-user',
  templateUrl: './information-about-user.component.html',
  styleUrls: ['./information-about-user.component.scss']
})
export class InformationAboutUserComponent implements OnInit {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private jsonInfo;
  

  constructor(private http: HttpClient, private router: Router
    , private _route: ActivatedRoute) {
  }
  
  
  ngOnInit() {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.jsonInfo = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
    var id = this._route.snapshot.queryParamMap.get('id');
    //console.log(this._route.snapshot.queryParamMap.get('id'))
    console.log(this.jsonInfo.token);
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.jsonInfo.token);
    //console.log('headers' + headers)
    var url = 'http://localhost:3001/users/' + id;
    console.log(url);
    console.log(headers);
    const options = {headers: headers};
    
    return this.http.get<any>(url, options)
   .pipe(map(user => {
    console.log(user);
    return user;
  }));
  }

  /*getUserInformation(id: string){
    const params = new HttpParams()
    .set('id', id)
    console.log(params.toString());
    var headers_object = new HttpHeaders().set("Authorization", "Bearer " + this.jsonInfo.token);
    console.log('header ' + headers_object);
    var url = 'http://localhost:3001/users/' + id;
    console.log(url);
    return this.http.get<any>(url, {params})
    .pipe(map(user => {
      console.log(user);
      return user;
    }));
  }*/



}
