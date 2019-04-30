import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { HomeComponent } from './home/home.component';
import { InformationAboutUserComponent } from './information-about-user/information-about-user.component';
import { AdminComponent } from './admin/admin.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageTIComponent } from './manage-ti/manage-ti.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { fakeBackendProvider } from './services/fake-backend';
import { JwtInterceptor } from './services/jwt.interceptor';
import { ErrorInterceptor } from './services/helpers.component';
import { DemoService } from './services/demo.service';
import { ProfileComponent } from './profile/profile.component';
import { UsersResolver } from './resolvers/users.resolver'
import { MDBBootstrapModule } from 'angular-bootstrap-md'
import { InformationUserResolver } from './resolvers/informationAboutUser.resolver';
import { CompteComponent } from './mon-compte/compte.component';
import { EntrantComponent } from './flux-entrant/entrant.component';
import { DiffusionComponent } from './diffusion/diffusion.component';
import { AbonnementComponent } from './page-abonnement/abonnement.component';
import { ManageDiffusionVideoComponent } from './manage-diffusion-video/manage-diffusion-video.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AuthentificationComponent,
    HomeComponent,
    InformationAboutUserComponent,
    AdminComponent,
    ManageUserComponent,
    ManageTIComponent,
    LoginComponent,
    ProfileComponent,
    CompteComponent,
    EntrantComponent,
    DiffusionComponent,
    AbonnementComponent,
    ManageDiffusionVideoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DemoService,

    // provider used to create fake backend
    fakeBackendProvider,
    UsersResolver,
    InformationUserResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
