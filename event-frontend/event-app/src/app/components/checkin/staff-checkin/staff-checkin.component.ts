import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckInService } from '../../../services/check-in.service';
import { CheckInAuditEntry } from '../../../models/check-in.model';

type BarcodeDetectorType = {
  new (options: { formats: string[] }): {
    detect: (video: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
  };
};

declare const BarcodeDetector: BarcodeDetectorType;

@Component({
  selector: 'app-staff-check-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-checkin.component.html',
  styleUrl: './staff-checkin.component.scss'
})
export class StaffCheckInComponent implements OnInit, OnDestroy {
  @ViewChild('video') videoElement?: ElementRef<HTMLVideoElement>;

  manualToken = '';
  scanStatus = '';
  scanError = '';
  isProcessing = false;
  recentCheckIns: CheckInAuditEntry[] = [];

  private stream?: MediaStream;
  private detector?: InstanceType<BarcodeDetectorType>;
  private scanActive = false;
  private lastToken = '';

  constructor(private checkInService: CheckInService) {}

  ngOnInit(): void {
    this.loadRecentCheckIns();
    this.startScanner();
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

  async startScanner(): Promise<void> {
    if (!('BarcodeDetector' in window)) {
      this.scanError = 'Barcode scanning is not supported in this browser. Use manual entry instead.';
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        await this.videoElement.nativeElement.play();
      }
      this.detector = new BarcodeDetector({ formats: ['qr_code'] });
      this.scanActive = true;
      this.scanLoop();
    } catch (error) {
      console.error('Camera access error:', error);
      this.scanError = 'Unable to access the camera. Check permissions and try again.';
    }
  }

  stopScanner(): void {
    this.scanActive = false;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = undefined;
    }
  }

  onManualSubmit(): void {
    if (!this.manualToken.trim()) {
      this.scanError = 'Enter a token before checking in.';
      return;
    }
    this.handleToken(this.manualToken.trim());
  }

  private scanLoop(): void {
    if (!this.scanActive || !this.detector || !this.videoElement) {
      return;
    }

    this.detector
      .detect(this.videoElement.nativeElement)
      .then(codes => {
        if (codes.length > 0 && !this.isProcessing) {
          const token = codes[0].rawValue;
          if (token && token !== this.lastToken) {
            this.handleToken(token);
          }
        }
      })
      .catch(() => {
        // Ignore frame-level decode errors and keep scanning.
      })
      .finally(() => {
        requestAnimationFrame(() => this.scanLoop());
      });
  }

  private handleToken(token: string): void {
    this.isProcessing = true;
    this.lastToken = token;
    this.scanStatus = 'Processing check-in...';
    this.scanError = '';

    this.checkInService.checkIn({ token }).subscribe({
      next: response => {
        this.scanStatus = response.message;
        this.manualToken = '';
        this.isProcessing = false;
        this.loadRecentCheckIns();
      },
      error: () => {
        this.scanError = 'Check-in failed. Verify the token and try again.';
        this.isProcessing = false;
      }
    });
  }

  private loadRecentCheckIns(): void {
    this.checkInService.getRecentCheckIns().subscribe({
      next: entries => {
        this.recentCheckIns = entries;
      },
      error: () => {
        this.scanError = 'Unable to load recent check-ins.';
      }
    });
  }
}
