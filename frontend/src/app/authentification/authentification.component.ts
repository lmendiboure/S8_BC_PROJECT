import { Component } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss']
})
export class AuthentificationComponent {
  registerForm: FormGroup;
  submitted = false;
  error = '';
  correct = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private authentificationService: AuthentificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      id: ['', Validators.required],
      pseudo: ['', Validators.required],
      password: ['', Validators.required]
    })

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  get f() { return this.registerForm.controls; }


  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    this.correct = true;
    this.authentificationService.register(this.f.id.value, this.f.pseudo.value, this.f.password.value).
      pipe(first())
      .subscribe(
        data => {
          Swal.fire(
            'Inscription réussie!',
            '',
            'success'
          ).then(function(){
            window.location.href='/login';
          })
        },
        error => {
          Swal.fire({
            type: 'error',
            title: "Erreur lors de l'inscription",
            text: error,
          }).then(function () {
            window.location.reload();
          });
          this.error = error;
        });

  }

}

