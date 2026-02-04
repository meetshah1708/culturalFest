export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

export const API_ENDPOINTS = {
  EVENTS: `${environment.apiUrl}/events`,
  ACTIVITIES: (eventId: number) => `${environment.apiUrl}/events/${eventId}/activities`,
  ACTIVITY_REGISTRATION: (eventId: number, activityId: number) => 
    `${environment.apiUrl}/events/${eventId}/activities/${activityId}/registrations`,
  CHECK_IN: `${environment.apiUrl}/checkin`,
  CHECK_IN_RECENT: `${environment.apiUrl}/checkin/recent`,
  VENUES: `${environment.apiUrl}/venues`,
  USERS: `${environment.apiUrl}/users`,
  AUTH: `${environment.apiUrl}/auth`
};
