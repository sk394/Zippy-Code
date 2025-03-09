package com.zippycode.ZippyCode.service;

import com.zippycode.ZippyCode.model.Solution;
import com.zippycode.ZippyCode.repository.SolutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolutionService {
    @Autowired
    private SolutionRepository solutionRepository;

    public List<Solution> getAllSolutions() {
        return solutionRepository.findAll();
    }

    public List<Solution> getSolutionsByQuestionId(String questionId) {
        return solutionRepository.findByQuestionId(questionId);
    }

    public Solution createSolution(Solution solution) {
        return solutionRepository.save(solution);
    }

    public Optional<Solution> updateSolution(String id, Solution solutionDetails) {
        return solutionRepository.findById(id)
                .map(existingSolution -> {
                    if (solutionDetails.getLang() != null) {
                        existingSolution.setLang(solutionDetails.getLang());
                    }
                    if (solutionDetails.getLangSlug() != null) {
                        existingSolution.setLangSlug(solutionDetails.getLangSlug());
                    }
                    if (solutionDetails.getCode() != null) {
                        existingSolution.setCode(solutionDetails.getCode());
                    }
                    return solutionRepository.save(existingSolution);
                });
    }

    public boolean deleteSolution(String id){
        return solutionRepository.findById(id)
                .map(solution -> {
                     solutionRepository.delete(solution);
                     return true;
        })
                .orElse(false);
    }
}
