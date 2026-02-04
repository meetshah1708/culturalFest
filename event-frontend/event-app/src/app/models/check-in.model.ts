export interface CheckInRequest {
  token: string;
}

export interface CheckInResponse {
  status: string;
  message: string;
  registrationId: number;
  checkedInAt?: string;
}

export interface CheckInAuditEntry {
  registrationId: number;
  attendeeName: string;
  activityName: string;
  checkedInAt: string;
}
