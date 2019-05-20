import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Router, ActivatedRoute} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthentificationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router,
    private _route: ActivatedRoute) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(JSON.stringify(localStorage.getItem('currentUser'))));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {

    return this.currentUserSubject.value;
  }

  login(pseudo: string, password: string){
    return this.http.post<any>('http://localhost:3001/users/login', { pseudo, password })
    .pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
      return user;
    }));
  }

  register(id: string, pseudo: string, password: string){
    var url = 'http://localhost:3001/users/signup/' + id;
    return this.http.patch<any>(url ,[
      {
        "propName":"pseudo", "value":pseudo
      },
      {
        "propName":"password", "value":password
      }
      ]
      )
  }

  updateInformation(pseudo: string, name: string, lastname: string, email:string,
    password:string, vehicle: string, year:number,immatriculation:string,id: string){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('currentUser.token'));
    return this.http.patch<any>('http://localhost:3001/users/profile/'+id,
    [
      {
        "propName":"name", "value":name
      },
      {
        "propName":"lastname", "value":lastname
      },
      {
        "propName":"email", "value":email
      },
      {
        "propName":"pseudo", "value":pseudo
      },
      {
        "propName":"immatriculation", "value":immatriculation
      },
      {
        "propName":"year", "value":year
      },
      {
        "propName":"vehicle", "value":vehicle
      },
      {
        "propName":"password", "value":password
      }
    ], { headers })
  }

  addUser(name:string,ip:string){
    return this.http.post<any>('http://localhost:3001/admin/',{name,ip});
  }

  deleteUser(name:string){
    var url = 'http://localhost:3001/admin/delete/';
    return this.http.post<any>(url,{name}).subscribe(data=>{console.log(data);window.location.reload()});
  }

  getUsers(){
    return console.log(this.http.get<any>('http://localhost:3001/admin/accounts'));
  }

  getSpecificUser(id: string, token: string) {
    var url = 'http://localhost:3001/users/'+id;
    let headers = new HttpHeaders().set('Authorization','Bearer '+ token);
    return this.http.get(url,{headers});

  }

  changeRights(ipx: string,ipy: string,value: string,token: string){
    var url = 'http://localhost:3001/admin/change';
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<any>(url,{ipx,ipy,value},{headers});
  }

  doReporting(title: string, description: string,date: string,token: string,id: string){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    var url = "http://localhost:3001/users/report/" + id;
    return this.http.post<any>(url,{title,description,date},{headers});
  }

  increaseTI(blockchainAddress: string){
    var url = "http://localhost:3001/users/trustIndex/increase/";
    return this.http.post<any>(url, {blockchainAddress});
  }

  decreaseTI(blockchainAddress: string) {
    var url = "http://localhost:3001/users/trustIndex/decrease/";
    return this.http.post<any>(url, { blockchainAddress });
  }

logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('id');
    localStorage.removeItem('informations');
    localStorage.removeItem('ip');
    localStorage.removeItem('isAdmin');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
