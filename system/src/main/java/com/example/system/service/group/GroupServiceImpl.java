package com.example.system.service.group;

import com.example.system.domain.model.Group;
import com.example.system.domain.model.User;
import com.example.system.repository.GroupRepository;
import com.example.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Group create(Group group, String ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found with id=" + ownerId));

        group.setOwner(owner);
        group.getAdmins().add(owner);
        group.getMembers().add(owner);
        group.setMemberCount(1);
        group.setPostCount(0);

        return groupRepository.save(group);
    }

    @Override
    @Transactional(readOnly = true)
    public Group getById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id=" + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Group> getAll() {
        return groupRepository.findAll();
    }

    @Override
    @Transactional
    public Group update(Long id, Group group) {
        Group existing = getById(id);
//TODO find more efficient way to validate
        if (group.getName() != null) {
            existing.setName(group.getName());
        }
        if (group.getDescription() != null) {
            existing.setDescription(group.getDescription());
        }
        if (group.getPrivacy() != null) {
            existing.setPrivacy(group.getPrivacy());
        }
        if (group.getLocation() != null) {
            existing.setLocation(group.getLocation());
        }

        return groupRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Group group = getById(id);
        groupRepository.delete(group);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Group> getByOwner(String ownerId) {
        return groupRepository.findByOwnerId(ownerId);
    }
}
