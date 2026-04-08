import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpaceXMission } from '../models/spacex-mission.model';

@Injectable({
  providedIn: 'root'
})
export class SpaceXService {
  private apiUrl = 'https://api.spacexdata.com/v3';

  constructor(private http: HttpClient) {}

  // Get all launches
  getAllMissions(): Observable<SpaceXMission[]> {
    console.log('Fetching all missions from SpaceX API...');
    return this.http.get<SpaceXMission[]>(`${this.apiUrl}/launches`);
  }

  // Get launches by year
  getMissionsByYear(year: number): Observable<SpaceXMission[]> {
    console.log(`Fetching missions for year ${year}...`);
    return this.http.get<SpaceXMission[]>(`${this.apiUrl}/launches?launch_year=${year}`);
  }

  // Get specific mission details by flight number
  getMissionDetails(flightNumber: number): Observable<SpaceXMission> {
    console.log(`Fetching mission details for flight ${flightNumber}...`);
    return this.http.get<SpaceXMission>(`${this.apiUrl}/launches/${flightNumber}`);
  }

  // Get all unique launch years
  getAllLaunchYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/launches/years`);
  }
}
