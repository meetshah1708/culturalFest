package com.fsd.event;

import com.fsd.event.entity.*;
import com.fsd.event.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.emptyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CheckInControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityRegistrationRepository registrationRepository;

    @Test
    void registrationReturnsCheckInToken() throws Exception {
        Event event = eventRepository.save(Event.builder()
                .eventName("Cultural Fest")
                .eventDescription("Fest")
                .eventDate(LocalDate.now())
                .build());
        Venue venue = venueRepository.save(Venue.builder()
                .venueName("Main Hall")
                .location("Campus")
                .capacity(100)
                .build());
        Activity activity = activityRepository.save(Activity.builder()
                .activityName("Dance")
                .activityDescription("Dance contest")
                .event(event)
                .venue(venue)
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusHours(1))
                .build());

        String payload = """
            {
              "email": "attendee@example.com",
              "full_name": "Test Attendee",
              "college_name": "Test College",
              "phone": "1234567890",
              "additional_info": "None"
            }
            """;

        mockMvc.perform(post("/api/events/%d/activities/%d/registrations".formatted(
                        event.getEventId(), activity.getActivityId()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.checkInToken", not(emptyString())));
    }

    @Test
    void checkInIsIdempotent() throws Exception {
        Event event = eventRepository.save(Event.builder()
                .eventName("Cultural Fest")
                .eventDescription("Fest")
                .eventDate(LocalDate.now())
                .build());
        Venue venue = venueRepository.save(Venue.builder()
                .venueName("Main Hall")
                .location("Campus")
                .capacity(100)
                .build());
        Activity activity = activityRepository.save(Activity.builder()
                .activityName("Music")
                .activityDescription("Music show")
                .event(event)
                .venue(venue)
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusHours(2))
                .build());
        User user = userRepository.save(User.builder()
                .fullName("Staff")
                .email("staff@example.com")
                .role("staff")
                .build());

        String token = UUID.randomUUID().toString();
        ActivityRegistration registration = registrationRepository.save(ActivityRegistration.builder()
                .activity(activity)
                .user(user)
                .checkInToken(token)
                .build());

        String request = """
            { "token": "%s" }
            """.formatted(token);

        mockMvc.perform(post("/api/checkin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("checked_in"))
                .andExpect(jsonPath("$.registrationId").value(registration.getRegistrationId()));

        mockMvc.perform(post("/api/checkin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("already_checked_in"));
    }
}
