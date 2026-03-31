package com.example.system.rest.controller;
import com.example.system.domain.model.chat.Conversation;
import com.example.system.domain.model.chat.Message;
import com.example.system.domain.model.chat.MessageStatus;
import com.example.system.repository.MessageRepository;
import com.example.system.service.chat.ChatService;
import com.example.system.rest.dto.chat.ChatMessageResponse;
import com.example.system.rest.dto.chat.ConversationReadResponseDto;
import com.example.system.rest.dto.mapper.ConversationMapper;
import com.example.system.rest.dto.mapper.MessageMapper;
import com.example.system.service.currentUser.CurrentUserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.BDDMockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
@WebMvcTest(controllers = ChatRestController.class)
@AutoConfigureMockMvc
public class ChatRestControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockitoBean
    private ChatService chatService;
    @MockitoBean
    private MessageRepository messageRepository;
    @MockitoBean
    private ConversationMapper conversationMapper;
    @MockitoBean
    private MessageMapper messageMapper;
    @MockitoBean
    private CurrentUserService currentUserService;
    @Test
    @DisplayName("Test get conversations functionality")
    public void givenUserHasConversations_whenGetConversations_thenSuccessResponse() throws Exception {
        // given
        String userId = "user123";
        Conversation conv = new Conversation();
        conv.setId("conv1");
        List<Conversation> conversations = List.of(conv);
        ConversationReadResponseDto dto = new ConversationReadResponseDto("conv1", false, "name", Set.of(), LocalDateTime.now(), false);
        List<ConversationReadResponseDto> dtos = List.of(dto);
        BDDMockito.given(chatService.getUserConversations(userId)).willReturn(conversations);
        BDDMockito.given(conversationMapper.toDto(conversations)).willReturn(dtos);
        // when
        ResultActions result = mockMvc.perform(get("/api/chat/conversations")
                .contentType(MediaType.APPLICATION_JSON)
                .with(jwt().jwt(builder -> builder.subject(userId)))
        );
        // then
        result
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()", CoreMatchers.is(1)))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", CoreMatchers.is("conv1")));
    }
    @Test
    @DisplayName("Test get messages by conversation functionality")
    public void givenConversationExists_whenGetMessages_thenSuccessResponse() throws Exception {
        // given
        String conversationId = "conv1";
        Message msg = new Message();
        msg.setId("msg1");
        Page<Message> msgPage = new PageImpl<>(List.of(msg));
        ChatMessageResponse dto = new ChatMessageResponse("msg1", conversationId, "sender", "content", MessageStatus.SENT, LocalDateTime.now(), List.of());
        // Matcher for exact PageRequest
        BDDMockito.given(messageRepository.findByConversationIdAndDeletedFalse(
                eq(conversationId),
                any()
        )).willReturn(msgPage);
        BDDMockito.given(messageMapper.toDto(any(Message.class))).willReturn(dto);
        // when
        ResultActions result = mockMvc.perform(get("/api/chat/{conversationId}", conversationId)
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON)
                .with(jwt().jwt(builder -> builder.subject("user123")))
        );
        // then
        result
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content.size()", CoreMatchers.is(1)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].id", CoreMatchers.is("msg1")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].content", CoreMatchers.is("content")));
    }
}
