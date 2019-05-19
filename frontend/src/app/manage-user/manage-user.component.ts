import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { first } from 'rxjs/operators';
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
  userToSupervise;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService: AuthentificationService
  ) { 
  }

  ngOnInit() {
    this.addUserForm=this.formBuilder.group({
      name:['',Validators.required],
      ip:['',Validators.required]
    })
    this.researchForm=this.formBuilder.group({
      research:['',Validators.required],
    })

    this.users=this.route.snapshot.data['users'];
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.users.sort((a, b) => {return a.trustIndex-b.trustIndex}); 
    this.userToSupervise=this.users[0];
    console.log(this.userToSupervise)
  }

  get f() { return this.addUserForm.controls; }
  get g() { return this.researchForm.controls;}

  onSubmit() {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    }

    this.loadingAdd = true;
    this.authenticationService.addUser(this.f.name.value, this.f.ip.value)
      .pipe(first())
      .subscribe(
        data => {
          Swal.fire(
            'Utilisateur ajouté!',
            "Identifiant MangoDB:" + JSON.stringify(data.identifiant),
            'success',
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

  deleteUser(name:string){
    this.authenticationService.deleteUser(name);
  }
}
