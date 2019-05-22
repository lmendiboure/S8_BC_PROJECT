import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, SelectMultipleControlValueAccessor } from '@angular/forms';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { AuthentificationService } from '../services/authentification.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  ip;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthentificationService,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      pseudo: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  get f() { return this.loginForm.controls; }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.pseudo.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          localStorage.setItem("id",JSON.stringify(data.id));
          var id;
          id = localStorage.getItem('id').split('"')[1];
          var token;
          token=JSON.parse(localStorage.getItem('currentUser')).token;
          if(this.f.pseudo.value=="admin"){
            localStorage.setItem('isAdmin','true');
          }
          this.authenticationService.getSpecificUser(id,token).subscribe(data=>{
            localStorage.setItem('ip',data[0].ip)});
          Swal.fire(
            'Connexion réussie!',
            '',
            'success'
          ).then(function () {
            window.location.href = "#"
          })
        },
        error => {
          Swal.fire({
            type: 'error',
            title: "Erreur lors de la connexion",
            text: error,
          }).then(function () {
            window.location.reload();
          });
          this.error = error;
          this.loading = false;
        });
  }

}
