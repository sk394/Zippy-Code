package com.zippycode.ZippyCode.repository;

import com.zippycode.ZippyCode.model.Solution;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolutionRepository extends MongoRepository<Solution, String> {
    List<Solution> findByQuestionId(String questionId);

}
