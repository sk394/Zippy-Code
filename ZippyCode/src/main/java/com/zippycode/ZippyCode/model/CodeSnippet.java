package com.zippycode.ZippyCode.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodeSnippet {
    private String lang;
    private String langSlug;
    private String code;
}
