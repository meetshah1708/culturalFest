package com.fsd.event.controller;

import com.fsd.event.dto.ActivityRegistrationDTO;
import com.fsd.event.dto.ActivityRegistrationResponse;
import com.fsd.event.service.ActivityRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events/{eventId}/activities/{activityId}/registrations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ActivityRegistrationController {

    private final ActivityRegistrationService registrationService;

    @PostMapping
    public ActivityRegistrationResponse register(
        @PathVariable Long activityId, 
        @RequestBody ActivityRegistrationDTO dto
    ) {
        return registrationService.register(activityId, dto);
    }
}
