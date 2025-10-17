package com.example.system.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Table(name = "posts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(length = 200)
    String text;

    Long views = 0L;
    Long likes = 0L;


    @CreationTimestamp
    LocalDateTime createdAt;

    @UpdateTimestamp
    LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    Group group;


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "posts_images",
            joinColumns = @JoinColumn(name = "post_id")
    )
    @Column(name = "image_url")
    List<String> images;

    // @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    // List<Comment> comments = new ArrayList<>();

}
