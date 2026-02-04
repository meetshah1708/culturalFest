package com.fsd.event.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CheckInAuditEntry {
    private Long registrationId;
    private String attendeeName;
    private String activityName;
    private LocalDateTime checkedInAt;
}
