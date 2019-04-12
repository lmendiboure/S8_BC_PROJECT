import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service'
import { User } from '../models/user'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUser: User;
  profileForm: FormGroup;
  submitted = false;
  error = '';
  correct = false;
  returnUrl: string;


  constructor(
    private authentificationService: AuthentificationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    this.authentificationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.getUser();
    this.profileForm = this.formBuilder.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      vehicle: ['', Validators.required],
      year: ['', Validators.required],
      immatriculation: ['', Validators.required]
    })

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  get f() { return this.profileForm.controls; }

  getUser() {
    return this.currentUser;
  }

  onSubmit() {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }
    this.correct = true;

    this.authentificationService.updateInformation(this.currentUser.pseudo,this.currentUser.id,this.f.prenom.value, this.f.nom.value, this.f.mobile.value,
      this.f.email.value, this.f.password.value, this.f.vehicle.value, this.f.year.value, this.f.immatriculation.value).
      pipe(first())
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          this.correct = false;
          this.error = error;
        });

  }

}

