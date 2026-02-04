package com.fsd.event.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityRegistrationResponse {
    private String message;
    private Long registrationId;
    private String checkInToken;
}
