import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { TransportLoadComponent } from './pages/transport-load/transport-load.component';
import { EconomicModelingComponent } from './pages/economic-modeling/economic-modeling.component';
import { httpErrorInterceptor } from './interceptors/http-error.interceptor';


export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'user', component: UserPageComponent },
  {path: 'transport-load', component: TransportLoadComponent},
  {path: 'economic-modeling', component: EconomicModelingComponent}
];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideHttpClient(withInterceptors([httpErrorInterceptor]))]
};
