package edu.cit.fitflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Date;

@Data
@AllArgsConstructor
public class UserAchievementDTO {
    private String achievementTitle;
    private String achievementDescription;
    private String achievementImage;
    private Date dateAchieved;
}
