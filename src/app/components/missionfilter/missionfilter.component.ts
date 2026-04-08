import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { SpaceXService } from '../../services/spacex.service';
import { SpaceXMission } from '../../models/spacex-mission.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-missionfilter',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatChipsModule
  ],
  templateUrl: './missionfilter.component.html',
  styleUrls: ['./missionfilter.component.css']
})
export class MissionFilterComponent implements OnInit {
  missions: SpaceXMission[] = [];
  allMissions: SpaceXMission[] = [];
  years: number[] = [];
  searchYear = '';
  selectedYear: number | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private spacexService: SpaceXService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadYearsAndMissions();
  }

  loadYearsAndMissions(): void {
    this.isLoading = true;
    this.error = null;

    this.loadAllMissions();
  }

  loadAllMissions(): void {
    this.spacexService
      .getAllMissions()
      .pipe(
        catchError((err) => {
          console.error('Error loading missions:', err);
          this.error = 'Failed to load missions. Please try again later.';
          return of([] as SpaceXMission[]);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((data) => {
        this.allMissions = data;
        const uniqueYears = [...new Set(data.map((mission) => Number(mission.launch_year)))];
        this.years = uniqueYears.sort((a, b) => b - a);
        this.missions = data;
        this.cdr.detectChanges();
      });
  }

  filterByYear(year: number): void {
    this.selectedYear = year;
    this.searchYear = String(year);
    this.isLoading = true;
    this.error = null;

    // Use SpaceX launch filter endpoint for year-based filtering.
    this.spacexService
      .getMissionsByYear(year)
      .pipe(
        catchError((err) => {
          console.error('Error filtering missions by year:', err);
          this.error = 'Failed to filter missions by year. Please try again.';
          return of([] as SpaceXMission[]);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((data) => {
        this.missions = data;
        this.cdr.detectChanges();
      });
  }

  searchByYear(value: string): void {
    const trimmed = value.trim();
    if (!trimmed) {
      this.clearFilter();
      return;
    }

    const year = Number(trimmed);
    if (Number.isNaN(year)) {
      this.error = 'Please enter a valid launch year.';
      return;
    }

    this.filterByYear(year);
  }

  clearFilter(): void {
    this.selectedYear = null;
    this.searchYear = '';
    this.error = null;
    this.missions = this.allMissions;
    this.cdr.detectChanges();
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
