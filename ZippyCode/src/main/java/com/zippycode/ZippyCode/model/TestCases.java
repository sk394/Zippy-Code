package com.zippycode.ZippyCode.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCases {
    @Id
    private int id;
    private String input;
    private String expectedOutput;
}
