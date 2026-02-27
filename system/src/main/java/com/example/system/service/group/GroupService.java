package com.example.system.service.group;

import com.example.system.domain.model.Group;

import java.util.List;

public interface GroupService {

    Group create(Group group, String ownerId);

    Group getById(Long id);

    List<Group> getAll();

    Group update(Long id, Group group);

    void delete(Long id);

    List<Group> getByOwner(String ownerId);

}
