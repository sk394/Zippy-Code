package com.zippycode.ZippyCode.repository;

import com.zippycode.ZippyCode.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByLevel(String level);
    List<Question> findByTopicsContaining(String topic);
}
