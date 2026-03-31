package com.example.system.rest.controller;

import com.example.system.domain.model.notification.Notification;
import com.example.system.rest.dto.mapper.NotificationMapper;
import com.example.system.rest.dto.notification.NotificationReadResponseDto;
import com.example.system.service.currentUser.CurrentUserService;
import com.example.system.service.notification.NotificationService;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.BDDMockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = NotificationController.class)
@AutoConfigureMockMvc
public class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private NotificationService notificationService;

    @MockitoBean
    private NotificationMapper notificationMapper;

    @MockitoBean
    private CurrentUserService currentUserService;

    @BeforeEach
    public void setup() {
        BDDMockito.given(currentUserService.getCurrentUserId()).willReturn("user123");
    }

    @Test
    @DisplayName("Test get notifications")
    public void whenGetNotifications_thenSuccessResponse() throws Exception {
        Notification notification = new Notification();
        notification.setId(1L);
        Page<Notification> page = new PageImpl<>(List.of(notification));
        
        NotificationReadResponseDto dto = new NotificationReadResponseDto();
        dto.setId(1L);

        BDDMockito.given(notificationService.getNotificationsForUser(eq("user123"), any(Pageable.class))).willReturn(page);
        BDDMockito.given(notificationMapper.toReadResponseDto(notification)).willReturn(dto);

        mockMvc.perform(get("/api/v1/notifications")
                .param("page", "0")
                .param("size", "10")
                .with(jwt()))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].id", CoreMatchers.is(1)));
    }

    @Test
    @DisplayName("Test sync notifications")
    public void givenLastId_whenSync_thenSuccessResponse() throws Exception {
        Notification notification = new Notification();
        notification.setId(2L);
        List<Notification> list = List.of(notification);
        
        NotificationReadResponseDto dto = new NotificationReadResponseDto();
        dto.setId(2L);

        BDDMockito.given(notificationService.getMissedNotifications("user123", 1L)).willReturn(list);
        BDDMockito.given(notificationMapper.toReadResponseDto(notification)).willReturn(dto);

        mockMvc.perform(get("/api/v1/notifications/sync")
                .param("lastId", "1")
                .with(jwt()))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", CoreMatchers.is(2)));
    }

    @Test
    @DisplayName("Test mark as read")
    public void givenId_whenMarkAsRead_thenNoContent() throws Exception {
        Long id = 1L;
        BDDMockito.doNothing().when(notificationService).markAsRead(id, "user123");

        mockMvc.perform(put("/api/v1/notifications/{id}/read", id)
                .with(jwt()))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @DisplayName("Test mark all as read")
    public void whenMarkAllAsRead_thenNoContent() throws Exception {
        BDDMockito.doNothing().when(notificationService).markAllAsRead("user123");

        mockMvc.perform(put("/api/v1/notifications/read-all")
                .with(jwt()))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @DisplayName("Test delete notification")
    public void givenId_whenDelete_thenNoContent() throws Exception {
        Long id = 1L;
        BDDMockito.doNothing().when(notificationService).deleteNotification(id, "user123");

        mockMvc.perform(delete("/api/v1/notifications/{id}", id)
                .with(jwt()))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @DisplayName("Test delete all notifications")
    public void whenDeleteAll_thenNoContent() throws Exception {
        BDDMockito.doNothing().when(notificationService).deleteAllNotifications("user123");

        mockMvc.perform(delete("/api/v1/notifications")
                .with(jwt()))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
