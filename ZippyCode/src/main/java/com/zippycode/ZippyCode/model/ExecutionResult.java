package com.zippycode.ZippyCode.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExecutionResult {
    private boolean success;
    private String actualOutput;
    private String errorMessage;
}
