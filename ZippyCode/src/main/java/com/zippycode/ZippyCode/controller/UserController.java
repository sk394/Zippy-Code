package com.zippycode.ZippyCode.controller;

import com.zippycode.ZippyCode.model.User;
import com.zippycode.ZippyCode.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/top-10")
    public ResponseEntity<List<User>> getWeeklyTop10Users() {
        return new ResponseEntity<>(userService.getAllUsersByTopScore(), HttpStatus.OK);
    }

    @PutMapping("/{userId}/score")
    public ResponseEntity<User> updateUserScore(@PathVariable String userId) {
        try {
            User updatedUser = userService.updateScoreForUser(userId);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
