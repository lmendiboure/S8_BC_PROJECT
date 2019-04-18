import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  addUserForm: FormGroup;
  researchForm: FormGroup;


  loadingAdd = false;
  loadingResearch = false;
  submitted = false;
  booleanSearch = false;

  returnUrl: string;
  error='';
  users: User[]=[];
  userSearch;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authenticationService: AuthentificationService
  ) { 
  }

  ngOnInit() {
    this.addUserForm=this.formBuilder.group({
      name:['',Validators.required],
    })
    this.researchForm=this.formBuilder.group({
      research:['',Validators.required],
    })

    this.users=this.route.snapshot.data['users'];
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.addUserForm.controls; }
  get g() { return this.researchForm.controls;}

  onSubmit() {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    }

    this.loadingAdd = true;
    this.authenticationService.addUser(this.f.name.value)
      .pipe(first())
      .subscribe(
        data => {
          Swal.fire(
            'Utilisateur ajouté!',
            '',
            'success'
          ).then(function () {
            window.location.reload();
          })
        },
        error => {
          this.error = error;
          this.loadingAdd = false;
        });
  }

  research(){
    this.loadingResearch=true
    this.userSearch = this.users.find(x=> x.name===this.g.research.value);
  }

  deleteUser(){
    console.log("Je suis ici");
    //this.authenticationService.deleteUser(name);
  }
}
