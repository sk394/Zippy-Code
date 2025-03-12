package com.zippycode.ZippyCode.controller;

import com.zippycode.ZippyCode.model.ExecutionResult;
import com.zippycode.ZippyCode.model.Question;
import com.zippycode.ZippyCode.model.Solution;
import com.zippycode.ZippyCode.model.TestCases;
import com.zippycode.ZippyCode.service.CodeExecutionService;
import com.zippycode.ZippyCode.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/code")
public class CodeExecutionController {
    @Autowired
    private CodeExecutionService codeExecutionService;

    @Autowired
    private QuestionService questionService;

    @PostMapping("/submit")
    public ResponseEntity<ExecutionResult> submitSolution(@RequestBody Solution request) {
        // find the question
        Optional<Question> question = questionService.getQuestionById(request.getQuestionId());
        Question questionOpt = question.get();
        TestCases testCase = questionOpt.getTestCases();
        ExecutionResult result = codeExecutionService.execute(request.getCode(), testCase.getInput(), testCase.getExpectedOutput());
        ExecutionResult submissionResult = new ExecutionResult(
                result.isSuccess(),
                result.getActualOutput(),
                result.getErrorMessage()
        );
        return ResponseEntity.ok(submissionResult);
    }
}
