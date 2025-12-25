package com.example.system.service.post;

import com.example.system.domain.model.Post;

import java.util.List;

public interface PostService {

    Post createPost(Post post);

    Post getPostById(Long id);

    List<Post> getAllPosts();

    Post updatePost(Long id, Post post);

    void deletePost(Long id);

    List<Post> getPostsByAuthorId(Long authorId);

    List<Post> getPostsByGroupId(Long groupId);

    List<Post> getTopPostsByViews();

    List<Post> getTopPostsByLikes();

    Post incrementViews(Long id);

    Post incrementLikes(Long id);

    Post decrementLikes(Long id);
}
