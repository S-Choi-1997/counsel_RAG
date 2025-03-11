package com.example.sociallogin.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    private String id;
    private String name;
    private String age;
    private String occupation;
    private String goal;
    private String note;
    private Date createdAt;
    private Date updatedAt;
}