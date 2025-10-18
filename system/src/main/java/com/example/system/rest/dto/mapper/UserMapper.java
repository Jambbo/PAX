package com.example.system.rest.dto.mapper;

import com.example.system.domain.model.User;
import com.example.system.rest.dto.user.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface UserMapper extends Mappable<User, UserDto> {


//    @Mapping(target = "id", source = "id")
//    @Mapping(target = "username", source = "username")
//    @Mapping(target = "email", source = "email")
//    @Mapping(target = "password", source = "password")
//    @Mapping(target = "firstName", source = "firstName")
//    @Mapping(target = "lastName", source = "lastName")
//    @Mapping(target = "bio", source = "bio")
//    @Mapping(target = "status", source = "status")
//    @Mapping(target = "isProfilePrivate", source = "isProfilePrivate")
//    @Mapping(target = "createdAt", source = "createdAt")
//    @Mapping(target = "updatedAt", source = "updatedAt")
//
//    // These fields are not part of DTO but exist in entity
//    @Mapping(target = "posts", ignore = true)
//    @Mapping(target = "groups", ignore = true)
//    @Mapping(target = "ownedGroups", ignore = true)
//    @Mapping(target = "friends", ignore = true)
    User fromDto(UserDto dto);

//    @Mappings({
//            @Mapping(target = "id", source = "id"),
//            @Mapping(target = "username", source = "username"),
//            @Mapping(target = "email", source = "email"),
//
//            // Password fields are WRITE_ONLY in DTO; skip mapping back
//            @Mapping(target = "password", ignore = true),
//            @Mapping(target = "passwordConfirmation", ignore = true),
//
//            @Mapping(target = "firstName", source = "firstName"),
//            @Mapping(target = "lastName", source = "lastName"),
//            @Mapping(target = "bio", source = "bio"),
//            @Mapping(target = "status", source = "status"),
//            @Mapping(target = "isProfilePrivate", source = "isProfilePrivate"),
//            @Mapping(target = "createdAt", source = "createdAt"),
//            @Mapping(target = "updatedAt", source = "updatedAt")
//    })
    UserDto toDto(User entity);

}
