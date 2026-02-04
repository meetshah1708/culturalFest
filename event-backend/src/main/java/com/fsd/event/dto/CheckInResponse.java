package com.fsd.event.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckInResponse {
    private String status;
    private String message;
    private Long registrationId;
    private LocalDateTime checkedInAt;
}
