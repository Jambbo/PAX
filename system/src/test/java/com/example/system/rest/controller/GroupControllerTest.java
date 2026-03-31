package com.example.system.rest.controller;
import com.example.system.domain.model.Group;
import com.example.system.rest.dto.group.GroupReadResponseDto;
import com.example.system.rest.dto.group.GroupWriteDto;
import com.example.system.rest.dto.mapper.GroupMapper;
import com.example.system.service.group.GroupService;
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
import java.util.List;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
@WebMvcTest(controllers = GroupController.class)
@AutoConfigureMockMvc
public class GroupControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockitoBean
    private GroupService groupService;
    @MockitoBean
    private GroupMapper groupMapper;
    @MockitoBean
    private com.example.system.service.currentUser.CurrentUserService currentUserService;
    @Test
    @DisplayName("Test create group")
    public void givenWriteDto_whenCreate_thenSuccessResponse() throws Exception {
        String userId = "user123";
        GroupWriteDto writeDto = new GroupWriteDto(null, "New Group", "Desc", com.example.system.domain.model.GroupPrivacy.PUBLIC, null, null);
        Group group = new Group();
        GroupReadResponseDto readDto = new GroupReadResponseDto(1L, "New Group", "Desc", null, null, null, null, null, 0, 0, false, null, null);
        BDDMockito.given(groupMapper.toEntity(any(GroupWriteDto.class))).willReturn(group);
        BDDMockito.given(groupService.create(any(Group.class), eq(userId))).willReturn(group);
        BDDMockito.given(groupMapper.toDto(group)).willReturn(readDto);
        mockMvc.perform(post("/api/v1/groups")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(writeDto))
                .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", CoreMatchers.is(1)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name", CoreMatchers.is("New Group")));
    }
    @Test
    @DisplayName("Test get by id")
    public void givenId_whenGetById_thenSuccessResponse() throws Exception {
        Long groupId = 1L;
        Group group = new Group();
        GroupReadResponseDto readDto = new GroupReadResponseDto(groupId, "New Group", "Desc", null, null, null, null, null, 0, 0, false, null, null);
        BDDMockito.given(groupService.getById(groupId)).willReturn(group);
        BDDMockito.given(groupMapper.toDto(group)).willReturn(readDto);
        mockMvc.perform(get("/api/v1/groups/{id}", groupId)
                .with(jwt()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", CoreMatchers.is(1)));
    }
    @Test
    @DisplayName("Test get all")
    public void whenGetAll_thenSuccessResponse() throws Exception {
        Group group = new Group();
        GroupReadResponseDto readDto = new GroupReadResponseDto(1L, "New Group", "Desc", null, null, null, null, null, 0, 0, false, null, null);
        BDDMockito.given(groupService.getAll(any())).willReturn(List.of(group));
        BDDMockito.given(groupMapper.toDto(List.of(group))).willReturn(List.of(readDto));
        mockMvc.perform(get("/api/v1/groups/all")
                .with(jwt()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", CoreMatchers.is(1)));
    }
    @Test
    @DisplayName("Test get my groups")
    public void whenGetMyGroups_thenSuccessResponse() throws Exception {
        String userId = "user123";
        Group group = new Group();
        GroupReadResponseDto readDto = new GroupReadResponseDto(1L, "New Group", "Desc", null, null, null, null, null, 0, 0, false, null, null);
        BDDMockito.given(groupService.getUserGroups(userId)).willReturn(List.of(group));
        BDDMockito.given(groupMapper.toDto(List.of(group))).willReturn(List.of(readDto));
        mockMvc.perform(get("/api/v1/groups/me")
                .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", CoreMatchers.is(1)));
    }
    @Test
    @DisplayName("Test get by owner")
    public void givenOwnerId_whenGetByOwner_thenSuccessResponse() throws Exception {
        String ownerId = "owner123";
        Group group = new Group();
        GroupReadResponseDto readDto = new GroupReadResponseDto(1L, "New Group", "Desc", null, null, null, null, null, 0, 0, false, null, null);
        BDDMockito.given(groupService.getByOwner(ownerId)).willReturn(List.of(group));
        BDDMockito.given(groupMapper.toDto(List.of(group))).willReturn(List.of(readDto));
        mockMvc.perform(get("/api/v1/groups/owner/{ownerId}", ownerId)
                .with(jwt()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", CoreMatchers.is(1)));
    }
    @Test
    @DisplayName("Test join group")
    public void givenId_whenJoinGroup_thenSuccessResponse() throws Exception {
        Long groupId = 1L;
        String userId = "user123";
        BDDMockito.doNothing().when(groupService).joinUser(groupId, userId);
        mockMvc.perform(post("/api/v1/groups/{groupId}/join", groupId)
                .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
    @Test
    @DisplayName("Test leave group")
    public void givenId_whenLeaveGroup_thenSuccessResponse() throws Exception {
        Long groupId = 1L;
        String userId = "user123";
        BDDMockito.doNothing().when(groupService).leaveUser(groupId, userId);
        mockMvc.perform(post("/api/v1/groups/{groupId}/leave", groupId)
                .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
    @Test
    @DisplayName("Test update group")
    public void givenWriteDto_whenUpdate_thenSuccessResponse() throws Exception {
        Long groupId = 1L;
        GroupWriteDto writeDto = new GroupWriteDto(groupId, "Updated", "Desc", com.example.system.domain.model.GroupPrivacy.PUBLIC, null, null);
        Group group = new Group();
        GroupReadResponseDto readDto = new GroupReadResponseDto(1L, "Updated", "Desc", null, null, null, null, null, 0, 0, false, null, null);
        BDDMockito.given(groupMapper.toEntity(any(GroupWriteDto.class))).willReturn(group);
        BDDMockito.given(groupService.update(eq(groupId), any(Group.class))).willReturn(group);
        BDDMockito.given(groupMapper.toDto(group)).willReturn(readDto);
        mockMvc.perform(put("/api/v1/groups/{groupId}", groupId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(writeDto))
                .with(jwt().jwt(b -> b.subject("user123"))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name", CoreMatchers.is("Updated")));
    }
    @Test
    @DisplayName("Test delete group")
    public void givenId_whenDelete_thenNoContent() throws Exception {
        Long groupId = 1L;
        BDDMockito.doNothing().when(groupService).delete(groupId);
        mockMvc.perform(delete("/api/v1/groups/{groupId}", groupId)
                .with(jwt().jwt(b -> b.subject("user123"))))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
