import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user;
  profileForm: FormGroup;
  submitted = false;
  error = '';
  correct = false;
  returnUrl: string;
  id;
  token;


  constructor(
    private authentificationService: AuthentificationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id=params['id'];
    });
    this.token=JSON.parse(localStorage.getItem('currentUser')).token;
    this.authentificationService.getSpecificUser(this.id, this.token).subscribe(data => localStorage.setItem('informations',JSON.stringify(data)));
    this.user=localStorage.getItem('informations');
    console.log(this.user);
    this.profileForm = this.formBuilder.group({
      pseudo: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      vehicle: ['', Validators.required],
      year: ['', Validators.required],
      immatriculation: ['', Validators.required]
    })
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  get f() { return this.profileForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }
    this.correct = true;
    this.authentificationService.updateInformation(this.f.pseudo.value,this.f.name.value, this.f.lastname.value,
      this.f.email.value, this.f.password.value, this.f.vehicle.value, this.f.year.value, this.f.immatriculation.value,this.id).
      pipe(first())
      .subscribe(
        data => {
          console.log(data);
          window.location.reload();
        },
        error => {
          console.log(error);
          this.correct = false;
          this.error = error;
        });

  }

}

