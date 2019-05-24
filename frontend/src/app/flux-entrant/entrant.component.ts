import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../services/authentification.service';


@Component({
  selector: 'app-flux-entrant',
  templateUrl: './entrant.component.html',
  styleUrls: ['./entrant.component.css']
})
export class EntrantComponent implements OnInit {

  list_video=[]
  /*variables prises dans la blockchaine*/
  like: number = 1000;
  dislike: number = 10;

  /*compteur de l'utilisateur*/
  compteur: number =0;
  userlike: number =0;
  userdislike: number =0;
  groupName;
  vidName;
  listOfEveryGroups;
  listOfEveryGroupsIP=[];
  listOfEveryGroupsName=[];
  IPurl;





  constructor(private http: HttpClient, private _route: ActivatedRoute,
  private router: Router, private authenticationService: AuthentificationService,) {


  }
/*  constructor(private countLike,) { }
  constructor(private countDislike,) { }*/



  ngOnInit(){
 //permet de lister les vidéos disponibles aux lancements de la page, il faut récupérer le nom du groupe dans le nom de la page abonnement pour pouvoir l'envoyer au serveur local à la place de l'adresse ip statique que j'ai mise, quand on clique sur le nom d'une vidéo faut que ça renvoit sur une nouvelle page pour pouvoir la visualiser ou alors le regarder sur la même page
//(pour plus tard) par exemple à gauche on affichera la vidéos en locale et à droite les vidéos sur le serveur ftp
//sur la page de la vidéo mettre bouton j'aime/j'aime pas demander à youssef et ayman je sais pas trop comment c'est censé marcher
    this.listOfEveryGroups = JSON.parse(localStorage.getItem('listGroups'));
    for (let idx in this.listOfEveryGroups) {
      // prend la liste des noms de groupes auquel on fait parti
      //ainsi que la liste des ip des groupes
      this.listOfEveryGroupsIP.push(this.listOfEveryGroups[idx].grIP);
      this.listOfEveryGroupsName.push(this.listOfEveryGroups[idx].name);


    }


    this._route.params.subscribe(paramsId => {
        this.groupName = paramsId.groupName;
        this.vidName   = paramsId.vidName;
    });
    for (let idx in this.listOfEveryGroupsName){
      if (this.groupName.localeCompare(this.listOfEveryGroupsName[idx] )==0) {
        this.IPurl=this.listOfEveryGroupsIP[idx]; //correspondance IP/ nom de groupe
      }
    }
    var url = 'http://localhost:2900/local_video_list/'+this.IPurl; // remplacer 225.0.0.1 par le nom du group dans la page
    console.log(url);
    this.http.get<any>(url,{observe:'response'}).subscribe(data=>{console.log(data);}); //la liste des vidéos d'un groupe est dans le body de data
  }

  //pour afficher une vidéo on le fait dans le html
  //<source src="http://127.0.0.1:2900/video" type="video/mp4"> il faut se débrouiller pour que dans le schéma apreès /video on mette le nom de la vidéo qui a été selectionné plus haut

    countLike(): void{

      if (this.compteur==0){
       this.like++;
       this.userlike++;
       this.compteur +=1;
     }
      else if (this.compteur!=0 && this.userdislike==1){
        this.like++;
        this.dislike--;
        this.userdislike--;
        this.userlike++;
        this.compteur+=1;
      }

      }

     countDislike(): void
  {
       if (this.compteur==0)
       {
         this.dislike++;
         this.userdislike++;
         this.compteur +=1;
        }

     else if (this.compteur!=0 && this.userlike==1)
     {
       this.dislike++;
       this.like--;
       this.userlike--;
       this.userdislike++;
       this.compteur+=1;
     }

  }

}
// ou autre idée sur la page abonnement faire la liste des groupes sous formes de menu déroulant et quand on clique dessus ça affiche la liste des vidéos sur la même page
//normalement tu as pas besoin de comprendre comment marche serveur local et au pire tu lis c'est pas difficile et si vraiment tu y arrives pas je t'expliquerai vite fait
