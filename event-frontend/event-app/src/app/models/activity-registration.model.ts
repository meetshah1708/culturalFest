export interface ActivityRegistration {
  full_name: string;
  email: string;
  college_name?: string;
  phone?: string;
  additional_info?: string;
}

export interface ActivityRegistrationResponse {
  message: string;
  registrationId: number;
  checkInToken: string;
}
