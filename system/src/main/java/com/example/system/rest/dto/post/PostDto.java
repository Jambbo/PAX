package com.example.system.rest.dto.post;

import com.example.system.rest.validation.OnCreate;
import com.example.system.rest.validation.OnUpdate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.hibernate.validator.constraints.Length;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostDto {

    @Null(message = "id must be null.", groups = OnCreate.class)
    @NotNull(message = "id is must be not null.", groups = OnUpdate.class)
    Long id;

    @NotBlank(message = "text is must be not null.", groups = OnCreate.class)
    @Length(
            max = 200,
            message = "text must be maximum {max} characters.",
            groups = {OnCreate.class, OnUpdate.class}
    )
    String text;

    @Null(message = "views must be null.", groups = {OnCreate.class, OnUpdate.class})
    Long views;

    @Null(message = "likes must be null.", groups = {OnCreate.class, OnUpdate.class})
    Long likes;

    @Null(groups = {OnCreate.class, OnUpdate.class})
    Long authorId;

    @NotNull(message = "group id must be not null.", groups = {OnCreate.class, OnUpdate.class})
    Long groupId;

//    @Size(
//            max = 8,
//            message = "no more than {max} images.",
//            groups = {OnCreate.class, OnUpdate.class}
//    )
//    List<
//            @Length(max = 500, message = "image url too long.",
//                    groups = {OnCreate.class, OnUpdate.class})
//                    String
//            >
//            images;

    @Null(message = "createdAt must be null.", groups = {OnCreate.class, OnUpdate.class})
    String createdAt;

    @Null(message = "updatedAt must be null.", groups = {OnCreate.class, OnUpdate.class})
    String updatedAt;

}
