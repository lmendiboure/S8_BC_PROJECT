import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diffusion',
  templateUrl: './diffusion.component.html',
  styleUrls: ['./diffusion.component.css']
})
export class DiffusionComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {

  }

  popUp(){  
    Swal.fire(
      'Vidéo envoyée',
      '',
      'success').then(function(){
        window.location.reload();
      }
      )
  }


}
