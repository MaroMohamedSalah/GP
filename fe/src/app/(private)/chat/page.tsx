"use client";

import CustomButton from "@/app/components/atoms/button";
import CustomInput from "@/app/components/atoms/input";
import { Avatar, Card, CardBody } from "@heroui/react";
import type React from "react";

import { useState } from "react";
import { FaBrain } from "react-icons/fa";
import {
  LuSend,
  LuPlus,
  LuLogOut,
  LuMenu,
  LuX,
  LuScale,
  LuUser,
} from "react-icons/lu";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);

  const [chats] = useState<Chat[]>([
    {
      id: "1",
      title: "General Chat",
      lastMessage: "Hello! How can I help you today?",
      timestamp: new Date(),
    },
    {
      id: "2",
      title: "قضية قتل",
      lastMessage: "Let's discuss the project requirements",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "3",
      title: "يارب اهدي عمرو غنيم",
      lastMessage: "The implementation looks good",
      timestamp: new Date(Date.now() - 7200000),
    },
  ]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setCurrentMessage("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your message. How can I assist you further?",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex bg-gray-10">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 overflow-hidden bg-gray-90 border-r-1 border-gray-100 flex flex-col`}
      >
        {/* Logo and Header */}
        <div className="p-6 border-b-1 border-gray-50 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-60 to-secondary-60 rounded-lg flex items-center justify-center">
              <LuScale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Legal fusion Ai</h1>
          </div>

          <CustomButton
            className="w-full bg-gradient-to-r from-primary-60 to-primary-70 text-white"
            startContent={<LuPlus className="w-4 h-4" />}
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
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className="cursor-pointer hover:bg-gray-20 transition-colors"
              >
                <CardBody className="p-3">
                  <h4 className="font-medium text-gray-90 text-sm truncate">
                    {chat.title}
                  </h4>
                  <p className="text-xs text-gray-60 truncate mt-1">
                    {chat.lastMessage}
                  </p>
                  <span className="text-xs text-gray-50 mt-1">
                    {chat.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </CardBody>
              </Card>
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
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-30">Marwan Mohamed</p>
              <p className="text-xs text-gray-50">marwan@example.com</p>
            </div>
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
          <CustomButton
            variant="light"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <LuX className="w-5 h-5" />
            ) : (
              <LuMenu className="w-5 h-5" />
            )}
          </CustomButton>

          <div className="flex items-center gap-3">
            <div>
              <h2 className="font-medium">Lawyer Assistant</h2>
              <p className="text-xs text-accent-50">Online</p>
            </div>
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
    </div>
  );
}
