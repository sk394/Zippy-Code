package com.zippycode.ZippyCode.service;

import com.zippycode.ZippyCode.model.User;
import com.zippycode.ZippyCode.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllUsersByTopScore() {
      return userRepository.findAll(Sort.by(Sort.Direction.DESC, "score")).stream()
              .limit(10)
              .collect(Collectors.toList());
    }

    public User updateScoreForUser(String userId) {
        // Find the user by ID
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        User user = userOptional.get();

        // Update score (increment by 1, modify as needed)
        user.setScore(user.getScore() != null ? user.getScore() + 10 : 10);

        // Save and return the updated user
        return userRepository.save(user);
    }
}
