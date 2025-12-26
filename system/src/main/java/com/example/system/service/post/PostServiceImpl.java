package com.example.system.service.post;

import com.example.system.domain.model.Post;
import com.example.system.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    @Override
    @Transactional
    public Post createPost(Post post) {
        // Initialize views and likes to 0 if null
        if (post.getViews() == null) {
            post.setViews(0L);
        }
        if (post.getLikes() == null) {
            post.setLikes(0L);
        }
        return postRepository.save(post);
    }

    @Override
    @Transactional(readOnly = true)
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    @Transactional
    public Post updatePost(Long id, Post post) {
        Post existingPost = getPostById(id);

        if (post.getText() != null) {
            existingPost.setText(post.getText());
        }
        if (post.getGroup() != null) {
            existingPost.setGroup(post.getGroup());
        }
        if (post.getImages() != null) {
            existingPost.setImages(post.getImages());
        }

        return postRepository.save(existingPost);
    }

    @Override
    @Transactional
    public void deletePost(Long id) {
        Post post = getPostById(id);
        postRepository.delete(post);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getPostsByAuthorId(String authorId) {
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(authorId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getPostsByGroupId(Long groupId) {
        return postRepository.findByGroupIdOrderByCreatedAtDesc(groupId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getTopPostsByViews() {
        return postRepository.findTopByViews();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getTopPostsByLikes() {
        return postRepository.findTopByLikes();
    }

    @Override
    @Transactional
    public Post incrementViews(Long id) {
        //TODO implement batch processing instead of having a separate request for each view
        Post post = getPostById(id);
        post.setViews(post.getViews() != null ? post.getViews() + 1 : 1L);
        return postRepository.save(post);
    }

    @Override
    @Transactional
    public Post incrementLikes(Long id) {
        Post post = getPostById(id);
        post.setLikes(post.getLikes() != null ? post.getLikes() + 1 : 1L);
        return postRepository.save(post);
    }

    @Override
    @Transactional
    public Post decrementLikes(Long id) {
        Post post = getPostById(id);
        long currentLikes = post.getLikes() != null ? post.getLikes() : 0L;
        post.setLikes(Math.max(0L, currentLikes - 1));
        return postRepository.save(post);
    }
}
