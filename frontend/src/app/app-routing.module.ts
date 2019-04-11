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
import { UsersResolver } from './resolvers/users.resolver';

const routes: Routes = [
  {path: 'inscription', component: AuthentificationComponent},
  {path: 'userinformation', component: InformationAboutUserComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'admin/manageuser', component: ManageUserComponent, resolve: {users: UsersResolver}},
  {path: 'admin/manageTI', component: ManageTIComponent},
  {path: '', component: HomeComponent, canActivate: [GuardsComponent]},
  {path: 'login', component: LoginComponent },
  {path: 'profile', component: ProfileComponent}, 
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] 
})
export class AppRoutingModule { }
