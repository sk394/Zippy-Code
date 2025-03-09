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
 //   private boolean error;
//    private String message;
//    private String outputValue;
//    private String input;
//    private String expectedOutput;
}
