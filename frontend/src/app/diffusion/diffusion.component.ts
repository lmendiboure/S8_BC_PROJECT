import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams,HttpResponse, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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

  ngOnInit() { // rajouter au chargement de la page la liste des groupes disponible auquel envoyé faire une requête pour savoir l'appartenance des groupes et l'afficher grâce à un ngfor regarder la requee get plus bas à faire sur le serveur de youssef
    this.ip = localStorage.getItem('ip');
    console.log(this.ip);
  }

  onFileSelected(event) { //permet de choisir le nom de la vidéo à envoyé
    if (event.target.files.length > 0) {
      this.video=event.target.files[0].name;
      console.log(event.target.files[0].name);
    }
  }
  
  onGroupSelection(groupSelection){ //permet de choisir auquel envoyé pour la diffusion il reste à faire la requête get sur le server regarder plus bas comment faire la requête, remplace le port et le chemin et demander à youssef si il faut lui passer le nom de group en paramètre ou dans body
    console.log(groupSelection);
    //faire requête mongoDB pour avoir correspondance ip nom de groupe
    this.group=groupSelection;
  }
  
  ngOnClickDiffusion(){ //est appelée quand le bouton envoyé la vidéo est appuyé, normalement rien a changé, il faut que le path dans le send de la fonction get de diffusion du serv_local corresponde au dossier où la vidéo a été trouvé, car this.video ne récupère que le nom de la vidéo, essayé de récupérer le path à la place de vidéo pour améliorer.

    var url = 'http://localhost:2900/diffusion/'+this.video+'/'+this.group;
    console.log(url);
    this.http.get<any>(url,{ observe: 'response' }).subscribe(data=>{console.log(data);if(data.status==200){
    Swal.fire('Vidéo envoyée','','success')}
    else{		
	Swal.fire('Erreur lors de l\'envoi de la vidéo','','error')}
    });
    }
}
