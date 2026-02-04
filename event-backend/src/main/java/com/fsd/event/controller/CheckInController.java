package com.fsd.event.controller;

import com.fsd.event.dto.CheckInAuditEntry;
import com.fsd.event.dto.CheckInRequest;
import com.fsd.event.dto.CheckInResponse;
import com.fsd.event.service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/checkin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CheckInController {

    private final CheckInService checkInService;

    @PostMapping
    public CheckInResponse checkIn(@RequestBody CheckInRequest request) {
        try {
            return checkInService.checkIn(request.getToken());
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/recent")
    public List<CheckInAuditEntry> recentCheckIns() {
        return checkInService.getRecentCheckIns();
    }
}
