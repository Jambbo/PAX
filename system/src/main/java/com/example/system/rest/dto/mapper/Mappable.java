package com.example.system.rest.dto.mapper;

import java.util.List;

public interface Mappable<E, D> {

    E fromDto(D dto);

    D toDto(E entity);

    List<E> fromDto(List<D> dto);

    List<D> toDto(List<E> entities);

}
