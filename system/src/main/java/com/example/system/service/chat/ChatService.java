package com.example.system.service.chat;

import com.example.system.domain.model.chat.Message;
import com.example.system.rest.dto.chat.ChatMessageRequest;

public interface ChatService {

    Message sendMessage(String senderId, ChatMessageRequest request);

}
