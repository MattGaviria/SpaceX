import { Routes } from '@angular/router';
import { MissionFilterComponent } from './components/missionfilter/missionfilter.component';
import { MissionDetailsComponent } from './components/missiondetails/missiondetails.component';

export const routes: Routes = [
  { path: '', redirectTo: '/missions', pathMatch: 'full' },
  { path: 'missions', component: MissionFilterComponent },
  { path: 'missions-filter', redirectTo: '/missions', pathMatch: 'full' },
  { path: 'mission-details/:id', component: MissionDetailsComponent },
  { path: '**', redirectTo: '/missions' }
];
