package com.zippycode.ZippyCode.controller;

import com.zippycode.ZippyCode.model.Solution;
import com.zippycode.ZippyCode.service.SolutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/solutions")
public class SolutionController {
    @Autowired
    private SolutionService solutionService;

    @GetMapping
    public ResponseEntity<List<Solution>> getAllSolutions() {
        return ResponseEntity.ok(solutionService.getAllSolutions());
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<Solution>> getSolutionsByQuestionId(@PathVariable String questionId) {
        return ResponseEntity.ok(solutionService.getSolutionsByQuestionId(questionId));
    }

    @PostMapping
    public ResponseEntity<Solution> createSolution(@RequestBody Solution solution) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(solutionService.createSolution(solution));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Solution> updateSolution(
            @PathVariable String id,
            @RequestBody Solution solutionDetails) {
        return solutionService.updateSolution(id, solutionDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSolution(@PathVariable String id) {
        return solutionService.deleteSolution(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
