import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';   
import { User } from '../models/user';
import { Router} from '@angular/router';

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

  login(pseudo: string, password: string){
    return this.http.post<any>('/users/authenticate', { pseudo, password }).
    pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }

      return user;
    }));
  }
w
  register(id: string, pseudo: string, password: string){
    return this.http.post<any>('/inscription/newuser',{id,pseudo,password})
  }

  updateInformation(pseudo: string, id:string, prenom: string, nom:string,mobile: string,email: string, password:string, vehicle: string, year:number,immatriculation:string){
    return this.http.put<any>('/user/updateInformation', { pseudo,id,prenom, nom, mobile, email, password, vehicle, year, immatriculation })
  }

  addUser(name:string){
    return this.http.post<any>('/admin/adduser',{name});
  }

  getUsers(){
    return this.http.get<any>('/admin/getusers');
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);   
    this.router.navigate(['/login']); 
  }
}