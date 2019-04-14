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

  updateInformation(pseudo: string, id:string, prenom: string, nom:string,mobile: string,email: string, password:string, vehicle: string, year:number,immatriculation:string){
    return this.http.put<any>('/user/updateInformation', { pseudo,id,prenom, nom, mobile, email, password, vehicle, year, immatriculation })
  }

  addUser(name:string){
    return this.http.post<any>('http://localhost:3001/admin/',{name});
  }

  deleteUser(name:string){
    var url = 'http://localhost:3001/admin/delete';
    console.log(url);
    console.log('cc');
    return this.http.post<any>(url, {name});
  }

  /*getUsers(){
    return this.http.get<any>('http://localhost:3001/admin/accounts');
  }*/

  getSpecificUser(id: string, token: string) {
    
    var headers = new HttpHeaders();
    //headers.set('Content-Type', 'application/json');
    headers.set('Authorization', 'Bearer  ' + token);
    console.log('heey ' + token + id)

    let options = {headers: headers};

     
    var url = 'http://localhost:3001/users/' + id;
    console.log(url);

    //const options = {headers: headers};
    console.log(options);
    return this.http.get<any>(url, options)
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);   
    this.router.navigate(['/login']); 
  }
}