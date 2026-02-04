package com.fsd.event.repository;

import com.fsd.event.entity.ActivityRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRegistrationRepository extends JpaRepository<ActivityRegistration, Long> {
    boolean existsByUser_UserIdAndActivity_ActivityId(Long userId, Long activityId);
    Optional<ActivityRegistration> findByUser_UserIdAndActivity_ActivityId(Long userId, Long activityId);
    List<ActivityRegistration> findAllByActivity_ActivityId(Long activityId);
    Optional<ActivityRegistration> findByCheckInToken(String checkInToken);
    List<ActivityRegistration> findTop10ByCheckedInAtNotNullOrderByCheckedInAtDesc();
}
