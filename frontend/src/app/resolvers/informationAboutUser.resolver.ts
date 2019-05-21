import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthentificationService} from '../services/authentification.service'


@Injectable()
export class InformationUserResolver implements Resolve<any>{


    constructor(private http: HttpClient
        ,private authenticationService: AuthentificationService) {
    }
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        var jsonInfo = JSON.parse(localStorage.getItem('currentUser'));
        return this.authenticationService.getSpecificUser(jsonInfo.id, jsonInfo.token);

    }
}