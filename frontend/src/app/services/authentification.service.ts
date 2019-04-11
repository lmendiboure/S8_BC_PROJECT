import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';   
import { User } from '../models/user';
import { Router} from '@angular/router';
//import { openSync } from 'fs';

@Injectable({ providedIn: 'root' })
export class AuthentificationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {

    return this.currentUserSubject.value;
  }

  login(email: string, password: string){
    return this.http.post<any>('http://localhost:3001/users/login', { email, password })
    .pipe(map(user => {
      console.log(user.token);
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }

      return user;
    }));
  }
w
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

  updateInformation(pseudo: string, id:string, prenom: string, nom:string,mobile: string,email: string, password:string, vehicle: string, year:number,immatriculation:string){
    return this.http.put<any>('/user/updateInformation', { pseudo,id,prenom, nom, mobile, email, password, vehicle, year, immatriculation })
  }

  addUser(name:string){
    return this.http.post<any>('http://localhost:3001/admin/',{name});
  }

  getUsers(){
    return this.http.get<any>('http://localhost:3001/admin/accounts');
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);   
    this.router.navigate(['/login']); 
  }
}