import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpaceXService } from '../../services/spacex.service';
import { SpaceXMission } from '../../models/spacex-mission.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-missionfilter',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './missionfilter.component.html',
  styleUrls: ['./missionfilter.component.css']
})
export class MissionFilterComponent implements OnInit {
  missions: SpaceXMission[] = [];
  allMissions: SpaceXMission[] = [];
  years: number[] = [];
  selectedYear: number | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private spacexService: SpaceXService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadYearsAndMissions();
  }

  loadYearsAndMissions(): void {
    this.isLoading = true;
    this.error = null;

    // Load all missions first
    this.spacexService.getAllMissions().subscribe({
      next: (data) => {
        this.allMissions = data;
        
        // Extract unique years and sort in descending order
        const uniqueYears = [...new Set(data.map(m => parseInt(m.launch_year)))];
        this.years = uniqueYears.sort((a, b) => b - a);
        
        this.missions = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading missions:', err);
        this.error = 'Failed to load missions. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  filterByYear(year: number): void {
    this.selectedYear = year;
    this.missions = this.allMissions.filter(
      m => parseInt(m.launch_year) === year
    );
  }

  clearFilter(): void {
    this.selectedYear = null;
    this.missions = this.allMissions;
  }

  viewDetails(mission: SpaceXMission): void {
    this.router.navigate(['/mission-details', mission.flight_number]);
  }

  getCountByYear(year: number): number {
    return this.allMissions.filter(
      m => parseInt(m.launch_year) === year
    ).length;
  }
}
