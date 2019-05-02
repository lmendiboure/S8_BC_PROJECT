import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-diffusion-video',
  templateUrl: './manage-diffusion-video.component.html',
  styleUrls: ['./manage-diffusion-video.component.scss']
})
export class ManageDiffusionVideoComponent implements OnInit {

  rightsForm: FormGroup;
  submitted = false;
  error = '';
  correct = false;
  returnUrl: string;
  token: string;

  constructor(
    private formBuilder: FormBuilder,
    private authentificationService: AuthentificationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.rightsForm = this.formBuilder.group({
      ipemetteur: ['', Validators.required],
      ipdest: ['', Validators.required],
      bool: ['', Validators.required]
    })

    this.token = JSON.parse(localStorage.getItem('currentUser')).token;
    console.log(this.token + "manage-diffusion");

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.rightsForm.controls; }


  onSubmit() {
    this.submitted = true;

    if (this.rightsForm.invalid) {
      return;
    }
    this.correct = true;
    this.authentificationService.changeRights(this.f.ipemetteur.value, this.f.ipdest.value, this.f.bool.value,this.token).
      pipe(first())
      .subscribe(
        data => {
          console.log(data);
          Swal.fire(
            'Inscription réussie!',
            '',
            'success'
          ).then(function () {
            window.location.href = '/login';
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
