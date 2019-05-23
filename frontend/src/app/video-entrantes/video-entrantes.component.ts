import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { AuthentificationService } from '../services/authentification.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-entrantes',
  templateUrl: './video-entrantes.component.html',
  styleUrls: ['./video-entrantes.component.scss']
})

export class VideoEntrantesComponent implements OnInit {

  groupName;
  listOfEveryGroups;
  listOfEveryGroupsIP=[];
  listOfEveryGroupsName=[];
  IPurl;
  Videos;
  VideosList=[];
  listVideos=[];

  constructor(private http: HttpClient,
    private authentificationService: AuthentificationService, private _route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.listOfEveryGroups = JSON.parse(localStorage.getItem('listGroups'));
    for (let idx in this.listOfEveryGroups) {
      // prend la liste des noms de groupes auquel on fait parti
      //ainsi que la liste des ip des groupes
      this.listOfEveryGroupsIP.push(this.listOfEveryGroups[idx].grIP);
      this.listOfEveryGroupsName.push(this.listOfEveryGroups[idx].name);


    }

    this._route.params.subscribe(paramsId => {
        this.groupName = paramsId.groupName;
    });

    console.log(this.groupName);
    for (let idx in this.listOfEveryGroupsName){
      if (this.groupName.localeCompare(this.listOfEveryGroupsName[idx] )==0) {
        this.IPurl=this.listOfEveryGroupsIP[idx]; //correspondance IP/ nom de groupe
      }
    }
    console.log(this.IPurl);
    var url = 'http://localhost:2900/local_video_list/'+this.groupName; // remplacer 225.0.0.1 par le nom du group dans la page
    this.http.get<any>(url,{observe:'response'}).subscribe(data=>
      {console.log(data);
        this.Videos=data.body.list;
        this.Videos=JSON.stringify(this.Videos);
        //console.log(this.Videos);
        console.log(this.Videos);
          for (let idx in this.Videos) {
              if((this.Videos[idx]).localeCompare("\\n")!=0 ){

                  this.listVideos.push(this.Videos[idx]);
                  console.log(this.listVideos[idx]);
                }


            }



      });


  }



  //pour afficher une vidéo on le fait dans le html
  //<source src="http://127.0.0.1:2900/video" type="video/mp4"> il faut se débrouiller pour que dans le schéma apreès /video on mette le nom de la vidéo qui a été selectionné plus haut






}
