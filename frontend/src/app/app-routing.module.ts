import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthentificationComponent} from './authentification/authentification.component';
import { InformationAboutUserComponent } from './information-about-user/information-about-user.component';
import { AdminComponent } from './admin/admin.component'
import { ManageUserComponent } from './manage-user/manage-user.component'
import { ManageTIComponent} from './manage-ti/manage-ti.component'
import { HomeComponent } from './home/home.component';
import { GuardsComponent } from './guards/guards.component';
import { LoginComponent} from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { CompteComponent } from './mon-compte/compte.component';
import { EntrantComponent } from './flux-entrant/entrant.component';
import { DiffusionComponent } from './diffusion/diffusion.component';
import { AbonnementComponent } from './page-abonnement/abonnement.component';
import { SuivreComponent } from './suivre/suivre.component';
import { ManageDiffusionVideoComponent } from './manage-diffusion-video/manage-diffusion-video.component';
import { GestionProblemesComponent } from './gestion-problemes/gestion-problemes.component';


import { UsersResolver } from './resolvers/users.resolver';
import { InformationUserResolver } from './resolvers/informationAboutUser.resolver';
import { SignalementsResolver } from './resolvers/signalements.resolver';



const routes: Routes = [
  { path: 'inscription', component: AuthentificationComponent},
  { path: 'userinformation',component: InformationAboutUserComponent, canActivate: [GuardsComponent], resolve: { information: InformationUserResolver}},
  { path: 'admin', component: AdminComponent,canActivate: [GuardsComponent]},
  { path: 'admin/manageuser', component: ManageUserComponent, canActivate: [GuardsComponent], resolve: {users: UsersResolver}},
  { path: 'admin/manageTI', component: ManageTIComponent, canActivate: [GuardsComponent], resolve: { users: UsersResolver }},
  { path: '', component: HomeComponent, canActivate: [GuardsComponent]},
  { path: 'login', component: LoginComponent },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [GuardsComponent],resolve: {information: InformationUserResolver}},
  { path: 'compte', component: CompteComponent, canActivate: [GuardsComponent]},
  { path: 'entrant', component: EntrantComponent, canActivate: [GuardsComponent]},
  { path: 'abonnement', component: AbonnementComponent, canActivate: [GuardsComponent] },
  { path: 'diffusion', component: DiffusionComponent, canActivate: [GuardsComponent] },
  { path: 'suivre', component: SuivreComponent, canActivate: [GuardsComponent] },
  { path: 'admin/managerights', component: ManageDiffusionVideoComponent, canActivate: [GuardsComponent]},
  { path: 'admin/manageissues', component: GestionProblemesComponent, canActivate: [GuardsComponent], resolve: {signalements: SignalementsResolver}},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
