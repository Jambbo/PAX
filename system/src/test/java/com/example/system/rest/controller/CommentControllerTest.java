package com.example.system.rest.controller;

import com.example.system.domain.model.Comment;
import com.example.system.rest.dto.comment.CommentReadResponseDto;
import com.example.system.rest.dto.comment.CommentWriteDto;
import com.example.system.rest.dto.mapper.CommentMapper;
import com.example.system.service.comment.CommentService;
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

@WebMvcTest(controllers = CommentController.class)
@AutoConfigureMockMvc
public class CommentControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockitoBean
    private CommentService commentService;
    @MockitoBean
    private CommentMapper commentMapper;
    @MockitoBean
    private com.example.system.service.currentUser.CurrentUserService currentUserService;

    @Test
    @DisplayName("Test add comment")
    public void givenCommentWriteDto_whenAddComment_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        String userId = "user123";
        CommentWriteDto writeDto = new CommentWriteDto("My comment");
        Comment comment = new Comment();
        CommentReadResponseDto readDto = new CommentReadResponseDto(1L, postId, "author1", "John", "My comment", 0L, 0L, false, null, null);
        BDDMockito.given(commentMapper.toEntity(any(CommentWriteDto.class))).willReturn(comment);
        BDDMockito.given(commentService.addComment(eq(postId), eq(userId), any(Comment.class))).willReturn(comment);
        BDDMockito.given(commentMapper.toDto(comment)).willReturn(readDto);
        ResultActions result = mockMvc.perform(post("/api/v1/posts/{postId}/comments", postId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(writeDto))
                .with(jwt().jwt(b -> b.subject(userId))));
        result.andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", CoreMatchers.is(1)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content", CoreMatchers.is("My comment")));
    }

    @Test
    @DisplayName("Test get comments by post")
    public void givenPostId_whenGetComments_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        Comment comment = new Comment();
        CommentReadResponseDto readDto = new CommentReadResponseDto(1L, postId, "author1", "John", "My comment", 0L, 0L, false, null, null);
        BDDMockito.given(commentService.getCommentsByPostId(postId)).willReturn(List.of(comment));
        BDDMockito.given(commentMapper.toDto(List.of(comment))).willReturn(List.of(readDto));
        ResultActions result = mockMvc.perform(get("/api/v1/posts/{postId}/comments", postId)
                .with(jwt()));
        result.andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", CoreMatchers.is(1)))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].content", CoreMatchers.is("My comment")));
    }

    @Test
    @DisplayName("Test update comment")
    public void givenWriteDto_whenUpdateComment_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        Long commentId = 1L;
        String userId = "user123";
        CommentWriteDto writeDto = new CommentWriteDto("Updated");
        Comment comment = new Comment();
        CommentReadResponseDto readDto = new CommentReadResponseDto(commentId, postId, "author1", "John", "Updated", 0L, 0L, true, null, null);
        BDDMockito.given(commentService.updateComment(eq(commentId), eq(userId), eq("Updated"))).willReturn(comment);
        BDDMockito.given(commentMapper.toDto(comment)).willReturn(readDto);
        mockMvc.perform(put("/api/v1/posts/{postId}/comments/{commentId}", postId, commentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(writeDto))
                        .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content", CoreMatchers.is("Updated")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.isEdited", CoreMatchers.is(true)));
    }

    @Test
    @DisplayName("Test delete comment")
    public void givenIds_whenDeleteComment_thenNoContent() throws Exception {
        Long postId = 1L;
        Long commentId = 1L;
        String userId = "user123";
        BDDMockito.doNothing().when(commentService).deleteComment(commentId, userId);
        mockMvc.perform(delete("/api/v1/posts/{postId}/comments/{commentId}", postId, commentId)
                        .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @DisplayName("Test like comment")
    public void givenIds_whenLike_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        Long commentId = 1L;
        String userId = "user123";
        Comment comment = new Comment();
        CommentReadResponseDto readDto = new CommentReadResponseDto(commentId, postId, "author1", "John", "My comment", 1L, 0L, false, null, null);
        BDDMockito.given(commentService.likeComment(commentId, userId)).willReturn(comment);
        BDDMockito.given(commentMapper.toDto(comment)).willReturn(readDto);
        mockMvc.perform(post("/api/v1/posts/{postId}/comments/{commentId}/like", postId, commentId)
                        .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.likes", CoreMatchers.is(1)));
    }

    @Test
    @DisplayName("Test dislike comment")
    public void givenIds_whenDislike_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        Long commentId = 1L;
        String userId = "user123";
        Comment comment = new Comment();
        CommentReadResponseDto readDto = new CommentReadResponseDto(commentId, postId, "author1", "John", "My comment", 0L, 1L, false, null, null);
        BDDMockito.given(commentService.dislikeComment(commentId, userId)).willReturn(comment);
        BDDMockito.given(commentMapper.toDto(comment)).willReturn(readDto);
        mockMvc.perform(post("/api/v1/posts/{postId}/comments/{commentId}/dislike", postId, commentId)
                        .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dislikes", CoreMatchers.is(1)));
    }

    @Test
    @DisplayName("Test remove interaction")
    public void givenIds_whenRemoveInteraction_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        Long commentId = 1L;
        String userId = "user123";
        Comment comment = new Comment();
        CommentReadResponseDto readDto = new CommentReadResponseDto(commentId, postId, "author1", "John", "My comment", 0L, 0L, false, null, null);
        BDDMockito.given(commentService.removeLikeOrDislike(commentId, userId)).willReturn(comment);
        BDDMockito.given(commentMapper.toDto(comment)).willReturn(readDto);
        mockMvc.perform(delete("/api/v1/posts/{postId}/comments/{commentId}/interaction", postId, commentId)
                        .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.likes", CoreMatchers.is(0)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.dislikes", CoreMatchers.is(0)));
    }
}
