package com.zippycode.ZippyCode.service;

import com.zippycode.ZippyCode.model.Question;
import com.zippycode.ZippyCode.model.User;
import com.zippycode.ZippyCode.repository.QuestionRepository;
import com.zippycode.ZippyCode.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    // create a question
    public Question createQuestion(Question question) {
        // If professorId is not set, use default "admin"
        if (question.getProfessorId() == null || question.getProfessorId().isEmpty()) {
            question.setProfessorId("admin");
        }
        // Initialize solvedByStudents if null
        if (question.getSolvedByStudents() == null) {
            question.setSolvedByStudents(new ArrayList<>());
        }
        return questionRepository.save(question);
    }

    public Optional<Question> updateQuestion(String id, Question questionDetails) {
        return questionRepository.findById(id)
                .map(existingQuestion -> {
                    if (questionDetails.getLevel() != null) {
                        existingQuestion.setLevel(questionDetails.getLevel());
                    }
                    if (questionDetails.getTopics() != null) {
                        existingQuestion.setTopics(questionDetails.getTopics());
                    }
                    if (questionDetails.getContent() != null) {
                        existingQuestion.setContent(questionDetails.getContent());
                    }
                    if (questionDetails.getCodeSnippets() != null) {
                        existingQuestion.setCodeSnippets(questionDetails.getCodeSnippets());
                    }
                    if(questionDetails.getTestCases() != null) {
                        existingQuestion.setTestCases(questionDetails.getTestCases());
                    }
                    return questionRepository.save(existingQuestion);
                });
    }

    public boolean deleteQuestion(String id) {
        return questionRepository.findById(id)
                .map(question -> {
                    questionRepository.delete(question);
                    return true;
                })
                .orElse(false);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public List<Question> getQuestionsByLevel(String level) {
        return questionRepository.findByLevel(level);
    }

    public List<Question> getQuestionsByTopic(String topic) {
        return questionRepository.findByTopicsContaining(topic);
    }

    public Question getQuestionById(String questionId) {
        return questionRepository.findById(questionId).orElseThrow(() -> new RuntimeException("Question not Found"));
    }

    // Mark a question as solved by a student
    public Question markQuestionAsSolved(String questionId, String studentId) {
        Question question = getQuestionById(questionId);

        // Initialize list if null
        if (question.getSolvedByStudents() == null) {
            question.setSolvedByStudents(new ArrayList<>());
        }

        // Add student ID if not already in the list
        if (!question.getSolvedByStudents().contains(studentId)) {
            question.getSolvedByStudents().add(studentId);
            return questionRepository.save(question);
        }

        return question;
    }

    // Get questions solved by a student
    public List<Question> getQuestionsSolvedByStudent(String studentId) {
        return questionRepository.findBySolvedByStudentsContaining(studentId);
    }

    // Get questions not solved by a student
    public List<Question> getQuestionsNotSolvedByStudent(String studentId) {
        return questionRepository.findQuestionsNotSolvedByStudent(studentId);
    }
}
