package com.zippycode.ZippyCode.repository;

import com.zippycode.ZippyCode.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByLevel(String level);
    List<Question> findByTopicsContaining(String topic);
    List<Question> findByProfessorId(String professorId);
    // Find questions solved by a specific student
    List<Question> findBySolvedByStudentsContaining(String studentId);
    // Find questions not solved by a specific student
    @Query("{ 'solvedByStudents' : { $not : { $elemMatch: { $eq: ?0 } } } }")
    List<Question> findQuestionsNotSolvedByStudent(String studentId);
}
