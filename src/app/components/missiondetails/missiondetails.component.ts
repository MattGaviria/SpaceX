import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { SpaceXService } from '../../services/spacex.service';
import { SpaceXMission } from '../../models/spacex-mission.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-missiondetails',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './missiondetails.component.html',
  styleUrls: ['./missiondetails.component.css']
})
export class MissionDetailsComponent implements OnInit {
  mission: SpaceXMission | null = null;
  isLoading = true;
  error: string | null = null;
  flightNumber: number | null = null;

  constructor(
    private spacexService: SpaceXService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.flightNumber = Number(params['id']);
      if (!Number.isNaN(this.flightNumber)) {
        this.loadMissionDetails(this.flightNumber);
      } else {
        this.error = 'No mission specified';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMissionDetails(flightNumber: number): void {
    this.isLoading = true;
    this.error = null;
    this.spacexService
      .getMissionDetails(flightNumber)
      .pipe(
        catchError((err) => {
          console.error('Error loading mission details:', err);
          this.error = 'Failed to load mission details. Please try again.';
          this.cdr.detectChanges();
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((data) => {
        this.mission = data;
        this.cdr.detectChanges();
      });
  }

  goBack(): void {
    this.router.navigate(['/missions']);
  }

  openLink(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
