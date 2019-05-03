import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diffusion',
  templateUrl: './diffusion.component.html',
  styleUrls: ['./diffusion.component.css']
})
export class DiffusionComponent implements OnInit {
  ip;
  currentUser;
  video;
  group;

  constructor(private router: Router,
    private _route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.ip = localStorage.getItem('ip');
    console.log(this.ip);
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.video=event.target.files[0].name;
      console.log(event.target.files[0].name);
    }
  }
  
  onGroupSelection(groupSelection) {
    console.log(groupSelection);
    //faire requête mongoDB pour avoir correspondance ip nom de groupe
    this.group=groupSelection;
  }
  
  ngOnClickDiffusion() {
    var url = 'http://localhost:2900/diffusion/'+this.video+'/'+this.group;
    console.log(url);
    this.http.get<any>(url).subscribe(data=>{console.log(data);});



    /*if(res==200){
    Swal.fire('Vidéo envoyée','','success')}
    else{		
	//Swal.fire('Erreur lors de l\'envoi de la vidéo','','error')}*/
    }

}
