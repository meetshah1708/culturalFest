import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../core/constants/api.constants';
import { CheckInAuditEntry, CheckInRequest, CheckInResponse } from '../models/check-in.model';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {
  constructor(private http: HttpClient) {}

  checkIn(request: CheckInRequest): Observable<CheckInResponse> {
    return this.http.post<CheckInResponse>(API_ENDPOINTS.CHECK_IN, request);
  }

  getRecentCheckIns(): Observable<CheckInAuditEntry[]> {
    return this.http.get<CheckInAuditEntry[]>(API_ENDPOINTS.CHECK_IN_RECENT);
  }
}
