package com.example.system.rest.controller;

import com.example.system.domain.model.Post;
import com.example.system.rest.dto.mapper.PostMapper;
import com.example.system.rest.dto.post.PostReadResponseDto;
import com.example.system.rest.dto.post.PostWriteDto;
import com.example.system.service.post.PostService;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = PostController.class)
@AutoConfigureMockMvc
public class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PostService postService;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private PostMapper postMapper;

    @MockitoBean
    private com.example.system.service.currentUser.CurrentUserService currentUserService;

    @Test
    @DisplayName("Test get post by ID")
    public void givenPostId_whenGetById_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        Post post = new Post();
        post.setId(postId);

        PostReadResponseDto dto = new PostReadResponseDto(postId, "Test content", null, null, null, null, null, null, null, null, null, false);

        BDDMockito.given(postService.getPostById(postId)).willReturn(post);
        BDDMockito.given(postMapper.toDto(post)).willReturn(dto);

        ResultActions result = mockMvc.perform(get("/api/v1/posts/{id}", postId)
                .contentType(MediaType.APPLICATION_JSON)
                .with(jwt()));

        result.andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", CoreMatchers.is(1)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.text", CoreMatchers.is("Test content")));
    }

    @Test
    @DisplayName("Test create post")
    public void givenPostWriteDto_whenCreate_thenSuccessResponse() throws Exception {
        String userId = "user123";
        PostWriteDto writeDto = new PostWriteDto(null, "New Post", null, null, 1L);
        Post post = new Post();
        Post savedPost = new Post();
        savedPost.setId(1L);

        PostReadResponseDto readDto = new PostReadResponseDto(1L, "New Post", null, null, null, null, null, null, null, null, null, false);

        BDDMockito.given(postMapper.toEntity(any(PostWriteDto.class))).willReturn(post);
        BDDMockito.given(postService.createPost(any(Post.class), eq(userId))).willReturn(savedPost);
        BDDMockito.given(postMapper.toDto(savedPost)).willReturn(readDto);

        ResultActions result = mockMvc.perform(post("/api/v1/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(writeDto))
                .with(jwt().jwt(builder -> builder.subject(userId))));

        result.andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", CoreMatchers.is(1)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.text", CoreMatchers.is("New Post")));
    }

    @Test
    @DisplayName("Test get all posts")
    public void givenPosts_whenGetAll_thenSuccessResponse() throws Exception {
        Post post = new Post();
        post.setId(1L);

        PostReadResponseDto dto = new PostReadResponseDto(1L, "Test content 1", null, null, null, null, null, null, null, null, null, false);

        BDDMockito.given(postService.getAllPosts()).willReturn(List.of(post));
        BDDMockito.given(postMapper.toDto(List.of(post))).willReturn(List.of(dto));

        ResultActions result = mockMvc.perform(get("/api/v1/posts/all")
                .contentType(MediaType.APPLICATION_JSON)
                .with(jwt()));

        result.andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", CoreMatchers.is(1)))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].text", CoreMatchers.is("Test content 1")));
    }

    @Test
    @DisplayName("Test update post")
    public void givenPostWriteDto_whenUpdate_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        PostWriteDto writeDto = new PostWriteDto(postId, "Updated Post", null, null, 1L);
        Post post = new Post();
        post.setId(postId);

        PostReadResponseDto readDto = new PostReadResponseDto(postId, "Updated Post", null, null, null, null, null, null, null, null, null, false);

        BDDMockito.given(postMapper.toEntity(any(PostWriteDto.class))).willReturn(post);
        BDDMockito.given(postService.updatePost(eq(postId), any(Post.class))).willReturn(post);
        BDDMockito.given(postMapper.toDto(post)).willReturn(readDto);

        ResultActions result = mockMvc.perform(put("/api/v1/posts/{postId}", postId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(writeDto))
                .with(jwt().jwt(builder -> builder.subject("user123"))));

        result.andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", CoreMatchers.is(1)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.text", CoreMatchers.is("Updated Post")));
    }

    @Test
    @DisplayName("Test delete post")
    public void givenPostId_whenDelete_thenNoContent() throws Exception {
        Long postId = 1L;
        BDDMockito.doNothing().when(postService).deletePost(postId);

        ResultActions result = mockMvc.perform(delete("/api/v1/posts/{postId}", postId)
                .with(jwt().jwt(builder -> builder.subject("user123"))));

        result.andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @DisplayName("Test get by author")
    public void givenAuthorId_whenGetByAuthor_thenSuccessResponse() throws Exception {
        String authorId = "author1";
        Post post = new Post();
        PostReadResponseDto dto = new PostReadResponseDto(1L, "Content", null, null, null, null, null, null, null, null, null, false);

        BDDMockito.given(postService.getPostsByAuthorId(authorId)).willReturn(List.of(post));
        BDDMockito.given(postMapper.toDto(List.of(post))).willReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/posts/author/{authorId}", authorId)
                .with(jwt()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", CoreMatchers.is(1)));
    }

    @Test
    @DisplayName("Test get by group")
    public void givenGroupId_whenGetByGroup_thenSuccessResponse() throws Exception {
        Long groupId = 1L;
        Post post = new Post();
        PostReadResponseDto dto = new PostReadResponseDto(1L, "Content", null, null, null, null, null, null, null, null, null, false);

        BDDMockito.given(postService.getPostsByGroupId(groupId)).willReturn(List.of(post));
        BDDMockito.given(postMapper.toDto(List.of(post))).willReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/posts/group/{groupId}", groupId)
                .with(jwt()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", CoreMatchers.is(1)));
    }

    @Test
    @DisplayName("Test trending views")
    public void whenGetTrendingByViews_thenSuccessResponse() throws Exception {
        Post post = new Post();
        PostReadResponseDto dto = new PostReadResponseDto(1L, "Content", null, null, null, null, null, null, null, null, null, false);

        BDDMockito.given(postService.getTopPostsByViews()).willReturn(List.of(post));
        BDDMockito.given(postMapper.toDto(List.of(post))).willReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/posts/trending/views").with(jwt()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", CoreMatchers.is(1)));
    }

    @Test
    @DisplayName("Test increment views")
    public void givenPostId_whenIncrementViews_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        Post post = new Post();
        PostReadResponseDto dto = new PostReadResponseDto(1L, "Content", null, null, null, null, null, null, null, null, null, false);

        BDDMockito.given(postService.incrementViews(postId)).willReturn(post);
        BDDMockito.given(postMapper.toDto(post)).willReturn(dto);

        mockMvc.perform(post("/api/v1/posts/{id}/view", postId).with(jwt()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", CoreMatchers.is(1)));
    }

    @Test
    @DisplayName("Test like post")
    public void givenPostId_whenLike_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        String userId = "user123";
        Post post = new Post();
        PostReadResponseDto dto = new PostReadResponseDto(1L, "Content", null, null, null, null, null, null, null, null, null, false);

        BDDMockito.given(postService.incrementLikesAndAddToUser(postId, userId)).willReturn(post);
        BDDMockito.given(postMapper.toDto(post)).willReturn(dto);

        mockMvc.perform(post("/api/v1/posts/{postId}/like", postId)
                .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", CoreMatchers.is(1)));
    }

    @Test
    @DisplayName("Test add bookmark")
    public void givenPostId_whenAddBookmark_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        String userId = "user123";

        BDDMockito.given(userService.addBookmark(userId, postId)).willReturn(new com.example.system.domain.model.User());

        mockMvc.perform(post("/api/v1/posts/{id}/bookmark", postId)
                .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @DisplayName("Test remove bookmark")
    public void givenPostId_whenRemoveBookmark_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        String userId = "user123";

        BDDMockito.given(userService.removeBookmark(userId, postId)).willReturn(new com.example.system.domain.model.User());

        mockMvc.perform(delete("/api/v1/posts/{id}/bookmark", postId)
                .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @DisplayName("Test get bookmarks")
    public void whenGetBookmarks_thenSuccessResponse() throws Exception {
        String userId = "user123";
        Post post = new Post();
        PostReadResponseDto dto = new PostReadResponseDto(1L, "Content", null, null, null, null, null, null, null, null, null, false);

        BDDMockito.given(userService.getBookmarkedPosts(userId)).willReturn(List.of(post));
        BDDMockito.given(postMapper.toDto(List.of(post))).willReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/posts/bookmarks")
                .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", CoreMatchers.is(1)));
    }

    @Test
    @DisplayName("Test get bookmark status")
    public void givenPostId_whenGetBookmarkStatus_thenSuccessResponse() throws Exception {
        Long postId = 1L;
        String userId = "user123";

        BDDMockito.given(userService.isBookmarked(userId, postId)).willReturn(true);

        mockMvc.perform(get("/api/v1/posts/{id}/bookmark/status", postId)
                .with(jwt().jwt(b -> b.subject(userId))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("true"));
    }
}
