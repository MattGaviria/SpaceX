import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { SpaceXService } from '../../services/spacex.service';
import { SpaceXMission } from '../../models/spacex-mission.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-missionlist',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './missionlist.component.html',
  styleUrls: ['./missionlist.component.css']
})
export class MissionListComponent implements OnInit {
  missions: SpaceXMission[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private spacexService: SpaceXService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMissions();
  }

  loadMissions(): void {
    this.isLoading = true;
    this.error = null;
    this.spacexService
      .getAllMissions()
      .pipe(
        catchError((err) => {
          console.error('Error loading missions:', err);
          this.error = 'Failed to load missions. Please try again later.';
          this.cdr.detectChanges();
          return of([] as SpaceXMission[]);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((data) => {
        this.missions = Array.isArray(data) ? data : [];
        this.cdr.detectChanges();
      });
  }

  viewDetails(mission: SpaceXMission): void {
    this.router.navigate(['/mission-details', mission.flight_number]);
  }
}
