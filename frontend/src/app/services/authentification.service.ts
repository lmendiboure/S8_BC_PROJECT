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

  login(email: string, password: string){
    return this.http.post<any>('http://localhost:3001/users/login', { email, password })
    .pipe(map(user => {
      // login successful if there's a jwt token in the response
      console.log(user.token);
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log(localStorage.currentUser);
        this.currentUserSubject.next(user);
      }
      return user;
    }));
  }

  register(id: string, email: string, password: string){
    var url = 'http://localhost:3001/users/signup/' + id;
    return this.http.patch<any>(url ,[
      {
        "propName":"email", "value":email
      },
      {
        "propName":"password", "value":password
      }
      ]
      )
  }

  updateInformation(name: string, surname: string, mail:string, 
    password:string, vehicle: string, year:number,immatriculation:string,id: string){
    console.log(id);
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('currentUser.token'));
    return this.http.patch<any>('http://localhost:3001/users/profile/'+id, 
    [
      {
        "propName":"name", "value":name
      },
      {
        "propName": "surname", "value": surname
      },
      {
        "propName":"mail", "value":mail
      },  
      {
        "propName":"password", "value":password
      },
      {
        "propName": "vehicle", "value": vehicle
      },
      {
        "propName": "year", "value": year
      },
      {
        "propName":"immatriculation", "value":immatriculation
      },
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
    var url = 'http://localhost:3001/users/' + id;
    let headers = new HttpHeaders().set('Authorization','Bearer '+ token);
    return this.http.get(url,{headers});
      
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('id');
    this.currentUserSubject.next(null);   
    this.router.navigate(['/login']); 
  }
}