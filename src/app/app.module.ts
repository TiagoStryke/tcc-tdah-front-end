import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { FilterPipe } from './helpers/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { HighlightDirective } from './helpers/directives/highlight.pipe';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgModule } from '@angular/core';
import { SignupComponent } from './components/signup/signup.component';
import { ToastrModule } from 'ngx-toastr';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HighlightDirective,
    LoginComponent,
    SignupComponent,
    MainPageComponent,
    DashboardComponent,
    FilterPipe,
  ],
  imports: [
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
