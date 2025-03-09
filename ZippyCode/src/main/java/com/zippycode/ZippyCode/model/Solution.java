package com.zippycode.ZippyCode.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "solutions")
@NoArgsConstructor
@AllArgsConstructor
public class Solution {
    @Id
    private String id;
    private String questionId;
    private String lang;
    private String langSlug;
    private String code;
}
