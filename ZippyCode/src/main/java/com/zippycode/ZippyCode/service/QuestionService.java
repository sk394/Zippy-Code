package com.zippycode.ZippyCode.service;

import com.zippycode.ZippyCode.model.Question;
import com.zippycode.ZippyCode.model.User;
import com.zippycode.ZippyCode.repository.QuestionRepository;
import com.zippycode.ZippyCode.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    // create a question
    public Question createQuestion(Question question) {
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

    public Optional<Question> getQuestionById(String questionId) {
        return questionRepository.findById(questionId);
    }
}
