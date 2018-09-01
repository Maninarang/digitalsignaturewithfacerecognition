import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { DigitalSignatureComponent } from './signature/DigitalSignature.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import {WebcamModule} from 'ngx-webcam';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfComponent } from './pdf/pdf.component';
import { FileDropModule } from 'ngx-file-drop';
import { DragndropComponent } from './dragndrop/dragndrop.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: RegisterComponent },
  { path: 'digitalsignature', component: DigitalSignatureComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'pdf', component: PdfComponent },
  { path: 'dnd', component: DragndropComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DigitalSignatureComponent,
    PdfComponent,
    DragndropComponent,
   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    WebcamModule,
    PdfViewerModule,
    FileDropModule
  ],
  providers: [
    AuthenticationService, 
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
