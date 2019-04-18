import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class UsersResolver implements Resolve<any>{
    constructor(private http: HttpClient){
    }
    resolve(route: ActivatedRouteSnapshot): Observable<any>{
        return this.http.get("http://localhost:3001/admin/accounts");
    }
}