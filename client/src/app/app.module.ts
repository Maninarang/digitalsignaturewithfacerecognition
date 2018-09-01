import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { ProfileComponent } from './profile/profile.component';
import { DigitalSignatureComponent } from './signature/DigitalSignature.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import { WebcamModule } from 'ngx-webcam';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfComponent } from './pdf/pdf.component';
import { FileDropModule } from 'ngx-file-drop';
import { DragndropComponent } from './dragndrop/dragndrop.component';
import { LoadingModule } from 'ngx-loading';
import {SlideshowModule} from 'ng-simple-slideshow';
import { QuillModule } from 'ngx-quill'
import { CookieService } from 'angular2-cookie/services/cookies.service';
//  import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { MatButtonModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { ActionrequestComponent } from './actionrequest/actionrequest.component';
import { DigitalSignComponent } from './digital-sign/digital-sign.component';
import { SavedImageComponent } from './saved-image/saved-image.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { CompletedComponent } from './completed/completed.component';
import { NgxCarouselModule } from 'ngx-carousel';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {DataTableModule} from "angular2-datatable";
import { MomentModule } from 'angular2-moment';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
// import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { SignpdfComponent } from './signpdf/signpdf.component';
// import { DashboardComponent } from './dashboard/dashboard.component';

// import { AddparticipantdialogComponent } from './addparticipantdialog/addparticipantdialog.component';
import { ModalModule } from 'ngx-modal';
import { ActionrequiredComponent } from './actionrequired/actionrequired.component';
import { ContactsarrayService } from './contactsarray.service';
import { DocumentdetailComponent } from './documentdetail/documentdetail.component';
import { DocumentuserdetailsComponent } from './documentuserdetails/documentuserdetails.component';


import { DashbordHeaderComponent } from './header_dashboard/header.component';
import { FooterComponent } from './footer_dashboard/footer.component';
import { MainSideBarComponent } from './main-side-bar/main-side-bar.component';
import { CompletedDocComponent } from './completed-doc/completed-doc.component';
import { PendingDocComponent } from './pending-doc/pending-doc.component';
import { DashboardComponent } from './dashboard/dashboard.component';



import { SafePipe } from './safe.pipe';
import { ConfirmComponent } from './confirm/confirm.component';
import { LandingComponent } from './landing/landing.component';
import { NewDocumentComponent } from './new-document/new-document.component';
import { NewsignpdfComponent } from './newsignpdf/newsignpdf.component';
import { ScrollToModule } from 'ng2-scroll-to-el';
import { VideorecComponent } from './videorec/videorec.component';
import { ComposemailComponent } from './composemail/composemail.component';
import { ReadmailComponent } from './readmail/readmail.component';
import { SentmailComponent } from './sentmail/sentmail.component';
import {PasswordfiletransferComponent} from './passwordfiletransfer/passwordfiletransfer.component';
import { TrashmailComponent } from './trashmail/trashmail.component';
import { ContactmailComponent } from './contactmail/contactmail.component';
import { ViewMailFileComponent } from './view-mail-file/view-mail-file.component';
import { ComposefiletransferComponent } from './composefiletransfer/composefiletransfer.component';
import { DicomviewerComponent } from './dicomviewer/dicomviewer.component';
import { FiletransferreadComponent } from './filetransferread/filetransferread.component';
import { ReadmailtranferComponent } from './readmailtranfer/readmailtranfer.component';
import { SenttransferComponent } from './senttransfer/senttransfer.component';
import { TrashtransferComponent } from './trashtransfer/trashtransfer.component';
import { ContacttransferComponent } from './contacttransfer/contacttransfer.component';
import { RejectedmassageComponent } from './rejectedmassage/rejectedmassage.component';
import { RejectedmailComponent } from './rejectedmail/rejectedmail.component';
import { FilepasswordComponent } from './filepassword/filepassword.component';
import { DicomviewComponent } from './dicomview/dicomview.component';
import { ExitinitialsComponent } from './exitinitials/exitinitials.component';

// import { ConfirmComponent } from './confirm/confirm.component';
// .component.spec

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'newdocument', component: NewDocumentComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'pendingdoc', component: PendingDocComponent },
  { path: 'completeddoc', component: CompletedDocComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'videorec',component:VideorecComponent},
  { path: 'composemail',component:ComposemailComponent},
  { path: 'readmail',component:ReadmailComponent},
  { path: 'sentmail',component:SentmailComponent},
  { path: 'trashmail',component:TrashmailComponent},
  { path: 'viewmail/:mailid',component:ViewMailFileComponent},
  { path: 'contactmail',component:ContactmailComponent},
  { path: 'filedownload/:id', component: PasswordfiletransferComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'digitalsignature', component: DigitalSignatureComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'pdfsign', component: PdfComponent, canActivate: [AuthGuardService] },
  { path: 'dnd', component: DragndropComponent },
  { path: 'actionrequest', component: ActionrequestComponent },
  { path: 'digital_sign/:type', component: DigitalSignComponent, canActivate: [AuthGuardService]},
  { path: 'saved_image', component: SavedImageComponent },
  { path: 'contact_list', component: ContactListComponent },
  { path: 'completed', component: CompletedComponent },
  { path: 'dashbordFooter', component: FooterComponent },
  { path: 'dashboardHeader', component: DashbordHeaderComponent },
  { path: 'MainSideBar', component: MainSideBarComponent },
  { path: 'actionrequired', component: ActionrequiredComponent },
  { path: 'documentdetail/:documentid', component: DocumentdetailComponent },
  { path: 'confirm/:userid', component: ConfirmComponent },
  { path: 'signpdf/:documentid/:userid/:usertosign', component: SignpdfComponent, canActivate: [AuthGuardService]},
  { path: 'newsign/:documentid/:userid/:usertosign', component: NewsignpdfComponent},
  { path: 'composefiletransfer', component: ComposefiletransferComponent, canActivate: [AuthGuardService]},
  { path: 'dicomviewer/:id', component: DicomviewerComponent },
  { path: 'filetransferread', component: FiletransferreadComponent },
  { path: 'readmailtransfer', component: ReadmailtranferComponent },
  { path: 'senttransfer', component: SenttransferComponent },
  { path: 'trashtransfer', component: TrashtransferComponent },
  { path: 'contacttransfer', component: ContacttransferComponent },
  { path: 'rejectedmassage', component: RejectedmassageComponent },
  { path: 'rejectedmail', component:  RejectedmailComponent },
  { path: 'filepassword/:id', component:  FilepasswordComponent },
  { path: 'exitmessage',component:ExitinitialsComponent},
  { path: 'dicomview', component:  DicomviewComponent  },

];

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    NewDocumentComponent,
   // NgxHmCarouselModule,
  //  DashboardComponent,
  NewsignpdfComponent,
    HomeComponent,
    HeaderComponent,
    DigitalSignatureComponent,
    PdfComponent,
    DragndropComponent,
    ActionrequestComponent,
    DigitalSignComponent,
    SavedImageComponent,
    ContactListComponent,
    CompletedComponent,
    SignpdfComponent,
    ActionrequiredComponent,
    DocumentdetailComponent,
    DocumentuserdetailsComponent,
    SafePipe,
    FooterComponent,
    DashbordHeaderComponent,
    MainSideBarComponent,
    DashboardComponent,
    PendingDocComponent,
    CompletedDocComponent,
    ConfirmComponent,
    LandingComponent,
    VideorecComponent,
    ComposemailComponent,
    ReadmailComponent,
    SentmailComponent,
    TrashmailComponent,
    ContactmailComponent,
    ViewMailFileComponent,
    ComposefiletransferComponent,
    DicomviewerComponent,
    FiletransferreadComponent,
    ReadmailtranferComponent,
    SenttransferComponent,
    TrashtransferComponent,
    ContacttransferComponent,
    RejectedmassageComponent,
    RejectedmailComponent,
    FilepasswordComponent,
    DicomviewComponent,
    PasswordfiletransferComponent,
    ExitinitialsComponent
    // AddparticipantdialogComponent
    ],
  imports: [
    ScrollToModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    WebcamModule,
    ModalModule,
    PdfViewerModule,
    FileDropModule,
    MatButtonModule,
    MatProgressBarModule,
    LoadingModule,
    MomentModule,
    NgxCarouselModule,
    SlideshowModule,
    DataTableModule,
    BootstrapModalModule,
    NgxMyDatePickerModule.forRoot(),
    DragAndDropModule.forRoot(),
    BsDropdownModule.forRoot(),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    QuillModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [
    AuthenticationService,
    AuthGuardService,
    ContactsarrayService,
    CookieService
  ],
  // entryComponents: [
  //   AddparticipantdialogComponent
  // ],
  bootstrap: [AppComponent]
})
export class AppModule { }
