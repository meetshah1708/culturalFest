package com.fsd.event.service;

import com.fsd.event.dto.CheckInAuditEntry;
import com.fsd.event.dto.CheckInResponse;
import com.fsd.event.entity.ActivityRegistration;
import com.fsd.event.repository.ActivityRegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final ActivityRegistrationRepository registrationRepository;

    public CheckInResponse checkIn(String token) {
        ActivityRegistration registration = registrationRepository.findByCheckInToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid check-in token"));

        if (registration.isCheckedIn()) {
            return new CheckInResponse(
                    "already_checked_in",
                    "Ticket has already been checked in.",
                    registration.getRegistrationId(),
                    registration.getCheckedInAt()
            );
        }

        registration.setCheckedIn(true);
        registration.setCheckedInAt(LocalDateTime.now());
        registrationRepository.save(registration);

        return new CheckInResponse(
                "checked_in",
                "Check-in successful.",
                registration.getRegistrationId(),
                registration.getCheckedInAt()
        );
    }

    public List<CheckInAuditEntry> getRecentCheckIns() {
        return registrationRepository.findTop10ByCheckedInAtNotNullOrderByCheckedInAtDesc()
                .stream()
                .map(registration -> new CheckInAuditEntry(
                        registration.getRegistrationId(),
                        registration.getUser().getFullName(),
                        registration.getActivity().getActivityName(),
                        registration.getCheckedInAt()
                ))
                .toList();
    }
}
