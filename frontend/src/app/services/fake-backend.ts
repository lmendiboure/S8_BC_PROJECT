import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http"
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError, from } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { DemoService } from './demo.service';
import { AuthentificationService } from './authentification.service';
import { promise } from 'protractor';
import { resolve } from 'dns';

@Injectable()
export class FakeBackendInterceptor {
    constructor(private http: HttpClient,
        private demoService: DemoService
    ) { }
    public users;
    public resultUsers;
    public userFind;


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let params = new HttpParams();
        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer jwt-token');
        let test3;

        function getUsers() {
            return new Promise(resolve=>{
                const res = fetch('http://localhost:3000/users')
                .then(response=>{
                    resolve(response.json());
                })      
            })
        }

        async function asyncCall() {
            var promise = await getUsers();
            return promise; 
        } 


        return of(null).pipe(mergeMap(() => {
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                var users;
                this.userFind=asyncCall().then(response=>{
                    users = JSON.stringify(response); 
                    var test = JSON.parse(users); 
                    var test2=test.find(x => x.pseudo === request.body.pseudo && x.password === request.body.password); 
                    return test2;
                }) 
                if (!this.userFind) return throwError({ status: 400, error: { message: "Pseudo ou mot de passe incorrect" } });
                return ok({
                    pseudo: this.userFind.pseudo,
                    password: this.userFind.password,
                    id: this.userFind.id,
                    prenom: this.userFind.prenom,
                    nom: this.userFind.nom,
                    mobile: this.userFind.mobile,
                    email: this.userFind.email,
                    vehicule: this.userFind.vehicule,
                    year: this.userFind.year,
                    immatriculation: this.userFind.immatriculation,
                    token: 'jwt-token',
                });
            }

            if (request.url.endsWith('/inscription/newuser') && request.method === 'POST') {
                this.http.post('http://localhost:3000/users', { id: request.body.id, pseudo: request.body.pseudo, password: request.body.password }).
                    subscribe(res => { console.log(res) });
                return ok({
                    pseudo: request.body.pseudo,
                    password: request.body.password,
                    id: request.body.password

                })
            }

            if (request.url.endsWith('/user/updateInformation') && request.method === "PUT") {
                let url = "http://localhost:3000/users/" + request.body.pseudo;
                console.log(url);
                this.http.put(url, {
                    prenom: request.body.prenom, pseudo: request.body.pseudo, id: request.body.id, nom: request.body.nom, mobile: request.body.mobile, email: request.body.email, password: request.body.password,
                    vehicle: request.body.vehicle, year: request.body.year, immatriculation: request.body.immatriculation
                })
                    .subscribe(res => { console.log(res) });
                this.http.get(url);
                return ok({
                    pseudo: request.body.pseudo,
                    id: request.body.id,
                    prenom: request.body.prenom,
                    nom: request.body.nom,
                    mobile: request.body.mobile,
                    email: request.body.email,
                    password: request.body.password,
                    vehicle: request.body.vehicle,
                    year: request.body.year,
                    immatriculation: request.body.immatriculation
                })
            }



            // get all users
            //if (request.url.endsWith('/users') && request.method === 'GET') {
            //if (!isLoggedIn) return unauthorised();
            //return ok(this.users);
            //}



            // pass through any requests not handled above
            return next.handle(request);
        }))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        // private helper functions

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

    }
}

export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};