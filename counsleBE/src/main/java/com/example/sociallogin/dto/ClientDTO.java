package com.example.sociallogin.dto;

import com.example.sociallogin.domain.Client;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private String id;
    private String name;
    private String age;
    private String occupation;
    private String goal;
    private String note;

    // Entity -> DTO 변환 메서드
    public static ClientDTO fromEntity(Client client) {
        return ClientDTO.builder()
                .id(client.getId())
                .name(client.getName())
                .age(client.getAge())
                .occupation(client.getOccupation())
                .goal(client.getGoal())
                .note(client.getNote())
                .build();
    }

    // DTO -> Entity 변환 메서드
    public Client toEntity() {
        return Client.builder()
                .id(this.id)
                .name(this.name)
                .age(this.age)
                .occupation(this.occupation)
                .goal(this.goal)
                .note(this.note)
                .build();
    }
}