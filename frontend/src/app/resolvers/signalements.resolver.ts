import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class SignalementsResolver implements Resolve<any>{
    constructor(private http: HttpClient) {
    }
    resolve(): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('currentUser.token'));
        return this.http.get("http://localhost:3001/admin/reports",{headers});
    }
}