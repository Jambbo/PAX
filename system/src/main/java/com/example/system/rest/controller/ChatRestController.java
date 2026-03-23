package com.example.system.rest.controller;

import com.example.system.domain.model.chat.Message;
import com.example.system.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final MessageRepository messageRepository;

    @GetMapping("/{conversationId}")
    public Page<Message> getMessages(
            @PathVariable String conversationId,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return messageRepository.findByConversationIdAndDeletedFalse(
                conversationId,
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
    }
}