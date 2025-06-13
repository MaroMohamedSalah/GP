"use client";

import CustomButton from "@/app/components/atoms/button";
import CustomInput from "@/app/components/atoms/input";
import ModalSelection from "@/app/components/molecules/AIModelSelection";
import {
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import type React from "react";

import { useState } from "react";
import { FaBrain } from "react-icons/fa";
import { LuSend, LuPlus, LuLogOut, LuScale, LuUser } from "react-icons/lu";

interface User {
  _id: string;
  username: string;
  email: {
    content: string;
    isVerified: boolean;
  };
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  description?: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
  aiModel: string;
}

export default function ChatPage() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [newChatDescription, setNewChatDescription] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const userData: User | null = JSON.parse(
    localStorage.getItem("userData") || "null"
  );

  // Get current chat messages
  const currentChat =
    chats.find((chat) => chat.id === currentChatId) || chats[0];
  const messages = currentChat?.messages || [];

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: "user",
      timestamp: new Date(),
    };

    // Update the current chat's messages and last message
    const updatedChats = chats.map((chat) => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: newMessage.content,
          timestamp: new Date(),
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setCurrentMessage("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your message. How can I assist you further?",
        sender: "assistant",
        timestamp: new Date(),
      };

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, assistantMessage],
              lastMessage: assistantMessage.content,
              timestamp: new Date(),
            };
          }
          return chat;
        })
      );
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateNewChat = () => {
    if (!newChatTitle.trim()) return;

    const newChat: Chat = {
      id: Date.now().toString(),
      title: newChatTitle,
      description: newChatDescription,
      lastMessage: "New conversation started",
      timestamp: new Date(),
      aiModel: localStorage.getItem("aiModel") ?? "LegalQwen3-7B",
      messages: [
        {
          id: "1",
          content: "Hello! How can I help you with this new conversation?",
          sender: "assistant",
          timestamp: new Date(),
        },
      ],
    };

    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    setNewChatTitle("");
    setNewChatDescription("");
    setIsNewChatModalOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  return (
    <div className="h-screen flex bg-gray-10">
      {/* Sidebar */}
      <div
        className={`w-80 transition-all duration-300 overflow-hidden bg-gray-90 border-r-1 border-gray-100 flex flex-col`}
      >
        {/* Logo and Header */}
        <div className="p-6 border-b-1 border-gray-50 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-60 to-secondary-60 rounded-lg flex items-center justify-center">
              <LuScale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Legal fusion Ai</h1>
          </div>

          <CustomButton
            className="w-full bg-gradient-to-r from-primary-60 to-primary-70 text-white"
            startContent={<LuPlus className="w-4 h-4" />}
            onClick={() => setIsNewChatModalOpen(true)}
          >
            New Chat
          </CustomButton>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-30 mb-3">
            Recent Chats
          </h3>
          <div className="space-y-2">
            {chats &&
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`cursor-pointer transition-colors p-3 ${
                    currentChatId === chat.id
                      ? "border-l-4 border-l-primary-60 bg-gray-80"
                      : "hover:bg-gray-80"
                  }`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <h4 className="font-medium text-gray-30 text-sm truncate">
                    {chat.title} - {chat.aiModel}
                  </h4>
                  {chat.description && (
                    <p className="text-xs text-gray-40 truncate">
                      {chat.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-50 truncate mt-1">
                    {chat.lastMessage}
                  </p>
                  <span className="text-xs text-gray-50 mt-1">
                    {chat.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* User Profile and Logout */}
        <div className="p-4 border-t-1 border-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <Avatar
              className="w-8 h-8"
              fallback={<LuUser className="w-4 h-4" />}
            />
            {userData && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-30">
                  {userData.username}
                </p>
                <p className="text-xs text-gray-50">{userData.email.content}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <CustomButton
              variant="bordered"
              className="flex-1 border-accent-50 text-accent-50 hover:bg-accent-50 hover:text-white transition-colors"
              startContent={<LuLogOut className="w-4 h-4" />}
              fullWidth
            >
              Logout
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col text-white">
        {/* Chat Header */}
        <div className="bg-gray-70 border-b-1 border-gray-50 p-4 flex items-center gap-3">
          <div className="flex items-center gap-3">
            {currentChat ? (
              <div>
                <h2 className="font-medium">
                  {currentChat?.title} - {currentChat?.aiModel}
                </h2>
                <p className="text-xs text-accent-50">Online</p>
              </div>
            ) : (
              <div>
                <h2
                  className="font-medium"
                  onClick={() => setIsNewChatModalOpen(true)}
                >
                  Select a chat
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-gray-70 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[70%] ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar
                  className="w-8 h-8 flex-shrink-0"
                  fallback={
                    message.sender === "user" ? (
                      <LuUser className="w-4 h-4" />
                    ) : (
                      <FaBrain className="w-4 h-4" />
                    )
                  }
                />
                <div
                  className={`${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-primary-60 to-primary-70 text-white"
                      : "bg-gray-20 text-gray-90"
                  } rounded-2xl px-4 py-3`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.sender === "user"
                        ? "text-primary-10"
                        : "text-gray-60"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-gray-70 border-t-1 border-gray-50 p-4">
          <div className="flex gap-3 items-end">
            <CustomInput
              placeholder="Type your message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <CustomButton
              onClick={handleSendMessage}
              disabled={!currentMessage.trim()}
              className="text-white w-fit"
              isIconOnly
            >
              <LuSend className="w-4 h-4" />
            </CustomButton>
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      <Modal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
      >
        <ModalContent className="bg-gray-80 text-gray-30 border-1 border-gray-70">
          <ModalHeader className="border-b-1 border-gray-70">
            Create New Chat
          </ModalHeader>
          <ModalBody className="py-4">
            <div className="space-y-4">
              <div>
                <ModalSelection />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Chat Title
                </label>
                <CustomInput
                  placeholder="Enter chat title"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description (Optional)
                </label>
                <CustomInput
                  placeholder="Enter chat description"
                  value={newChatDescription}
                  onChange={(e) => setNewChatDescription(e.target.value)}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="border-t-1 border-gray-70">
            <CustomButton
              variant="bordered"
              className="border-gray-50 text-gray-40"
              onClick={() => setIsNewChatModalOpen(false)}
            >
              Cancel
            </CustomButton>
            <CustomButton
              className="bg-gradient-to-r from-primary-60 to-primary-70 text-white"
              onClick={handleCreateNewChat}
              disabled={!newChatTitle.trim()}
            >
              Create Chat
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
