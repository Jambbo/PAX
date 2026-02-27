package com.example.system.repository;

import com.example.system.domain.model.Group;
import com.example.system.domain.model.GroupPrivacy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findByOwnerId(String ownerId);

    List<Group> findByPrivacy(GroupPrivacy privacy);

    boolean existsByName(String name);

    boolean existsByIdAndOwnerId(Long groupId, String currentUserId);

}
