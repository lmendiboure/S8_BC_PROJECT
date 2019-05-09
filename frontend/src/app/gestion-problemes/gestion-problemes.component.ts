import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gestion-problemes',
  templateUrl: './gestion-problemes.component.html',
  styleUrls: ['./gestion-problemes.component.scss']
})
export class GestionProblemesComponent implements OnInit {

  signalements;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.signalements = this.route.snapshot.data['signalements'].response;
    console.log(this.signalements);
  }

}
