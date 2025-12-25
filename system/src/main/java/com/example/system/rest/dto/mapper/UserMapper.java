package com.example.system.rest.dto.mapper;

import com.example.system.domain.model.User;
import com.example.system.rest.dto.user.UserReadResponseDto;
import com.example.system.rest.dto.user.UserWriteDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    @Mapping(target = "id", ignore = true)
    public abstract User toEntity(UserWriteDto dto);

    public abstract List<User> toEntity(List<UserWriteDto> dtos);

    public abstract UserReadResponseDto toDto(User user);

    public abstract List<UserReadResponseDto> toDto(List<User> users);

}
