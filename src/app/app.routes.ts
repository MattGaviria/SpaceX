import { Routes } from '@angular/router';
import { MissionListComponent } from './components/missionlist/missionlist.component';
import { MissionFilterComponent } from './components/missionfilter/missionfilter.component';
import { MissionDetailsComponent } from './components/missiondetails/missiondetails.component';

export const routes: Routes = [
  { path: '', redirectTo: '/missions', pathMatch: 'full' },
  { path: 'missions', component: MissionListComponent },
  { path: 'missions-filter', component: MissionFilterComponent },
  { path: 'mission-details/:id', component: MissionDetailsComponent },
  { path: '**', redirectTo: '/missions' }
];
