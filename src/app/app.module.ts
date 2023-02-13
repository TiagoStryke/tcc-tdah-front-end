import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AdminComponent } from './components/admin/admin.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CodeGeneratorComponent } from './components/code-generator/code-generator.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeleteUserModalComponent } from './components/delete-dialog/delete-dialog.component';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { FilterPipe } from './helpers/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { HighlightDirective } from './helpers/directives/highlight.pipe';
import { LoginComponent } from './components/login/login.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './components/profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './components/signup/signup.component';
import { ToastrModule } from 'ngx-toastr';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HighlightDirective,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    FilterPipe,
    ProfileComponent,
    HeaderComponent,
    CodeGeneratorComponent,
    AdminComponent,
    DeleteUserModalComponent,
  ],
  imports: [
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    NgApexchartsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: true,
      preventDuplicates: true,
    }),
    ReactiveFormsModule,
  ],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
