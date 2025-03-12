package com.zippycode.ZippyCode.controller;

import com.zippycode.ZippyCode.model.Question;
import com.zippycode.ZippyCode.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/questions")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Question>> getQuestionById(@PathVariable String id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<List<Question>> getQuestionByLevel(@PathVariable String level) {
        return ResponseEntity.ok(questionService.getQuestionsByLevel(level));
    }

    @GetMapping("/topic/{topic}")
    public ResponseEntity<List<Question>> getQuestionByTopic(@PathVariable String topic) {
        return ResponseEntity.ok(questionService.getQuestionsByTopic(topic));
    }

    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(questionService.createQuestion(question));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable String id, @RequestBody
                                                   Question questionDetails) {
        return questionService.updateQuestion(id, questionDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable String id) {
        return questionService.deleteQuestion(id) ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
