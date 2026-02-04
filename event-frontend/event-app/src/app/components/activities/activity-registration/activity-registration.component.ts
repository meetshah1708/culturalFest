import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../../services/activity.service';
import { RegistrationService } from '../../../services/registration.service';
import { AuthService } from '../../../services/auth.service';
import { Activity } from '../../../models/activity.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-activity-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './activity-registration.component.html',
  styleUrl: './activity-registration.component.scss'
})
export class ActivityRegistrationComponent implements OnInit {
  activity: Activity | null = null;
  registrationForm: FormGroup;
  submitted = false;
  loading = true;
  submitting = false;
  error = '';
  success = '';
  checkInToken = '';
  qrCodeUrl = '';
  eventId: number = 0;
  activityId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private activityService: ActivityService,
    private registrationService: RegistrationService,
    private authService: AuthService
  ) {
    this.registrationForm = this.formBuilder.group({
      additional_info: ['']
    });
  }

  ngOnInit(): void {
    // First check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    const tokenFromQuery = this.route.snapshot.queryParamMap.get('token');
    if (tokenFromQuery) {
      this.success = this.route.snapshot.queryParamMap.get('message') ?? 'Registration successful!';
      this.checkInToken = tokenFromQuery;
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(tokenFromQuery)}`;
      this.loading = false;
      return;
    }

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (!id) {
          this.error = 'Invalid activity ID';
          return of(null);
        }
        this.activityId = id;
        // In a real app, we would have an API to get activity by ID directly
        // For now, we'll assume we're working with the first event
        this.eventId = 1; // This would be determined based on the actual route or API
        
        return this.activityService.getActivityById(this.eventId, this.activityId);
      })
    ).subscribe({
      next: (activity) => {
        if (activity) {
          this.activity = activity;
          this.prefillFormWithUserData();
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load activity details. Please try again later.';
        console.error('Error loading activity details:', error);
        this.loading = false;
      }
    });
  }

  prefillFormWithUserData(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // We don't need to set these fields in the form since they'll be sent from the auth service
      // but we're preparing them here for demonstration
      // In a real app, we might want to show the user's info on the form for verification
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registrationForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }

    this.submitting = true;
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      this.error = 'You must be logged in to register for activities';
      this.submitting = false;
      return;
    }

    const registrationData = {
      full_name: currentUser.full_name,
      email: currentUser.email,
      college_name: currentUser.college_name,
      phone: currentUser.phone,
      additional_info: this.f['additional_info'].value
    };

    this.registrationService.registerForActivity(this.eventId, this.activityId, registrationData)
      .subscribe({
        next: (response) => {
          this.success = response.message;
          this.checkInToken = response.checkInToken;
          this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(response.checkInToken)}`;
          this.submitting = false;
          // Reset the form
          this.registrationForm.reset();
          this.submitted = false;
        },
        error: (error) => {
          this.error = 'Registration failed. Please try again later.';
          console.error('Registration error:', error);
          this.submitting = false;
        }
      });
  }
}
