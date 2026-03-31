package com.example.system.rest.controller;

import com.example.system.domain.model.User;
import com.example.system.domain.model.UserStatus;
import com.example.system.rest.dto.mapper.PostMapper;
import com.example.system.rest.dto.mapper.UserMapper;
import com.example.system.rest.dto.user.UserReadResponseDto;
import com.example.system.service.user.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.BDDMockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private UserMapper userMapper;

    @MockitoBean
    private PostMapper postMapper;

    @MockitoBean
    private com.example.system.service.currentUser.CurrentUserService currentUserService;

    @Test
    @DisplayName("Test get user by id functionality")
    public void givenId_whenGetById_thenSuccessResponse() throws Exception {
        //given
        String userId = "user123";
        User user = new User();
        user.setId(userId);
        
        UserReadResponseDto dto = new UserReadResponseDto(userId, "john_doe", "john@email.com", "John", "Doe", "bio", UserStatus.ONLINE, false, java.time.LocalDateTime.now(), java.time.LocalDateTime.now());
        
        BDDMockito.given(userService.getUserById(userId)).willReturn(user);
        BDDMockito.given(userMapper.toDto(user)).willReturn(dto);

        //when
        ResultActions result = mockMvc.perform(get("/api/v1/users/{id}", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .with(jwt().jwt(builder -> builder.subject("callerId")))
        );

        //then
        result
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", CoreMatchers.is(userId)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName", CoreMatchers.is("John")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName", CoreMatchers.is("Doe")));
    }
}

