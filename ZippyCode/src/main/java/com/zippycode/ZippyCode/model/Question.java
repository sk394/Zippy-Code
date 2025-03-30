package com.zippycode.ZippyCode.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    private String id;
    private String professorId;

    private String level;
    private List<String> topics;
    private String content;
    private List<CodeSnippet> codeSnippets;
    private TestCases testCases;
    private List<String> solvedByStudents;
}
