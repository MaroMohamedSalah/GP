"use client";

import { getAllChats } from "@/app/actions/getAllChats";
import { sendMessage } from "@/app/actions/sendMessage";
import { startNewChat } from "@/app/actions/startNewChat";
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
  Spinner,
  Tooltip,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import type React from "react";

import { useEffect, useState, useRef } from "react";
import { FaBrain } from "react-icons/fa";
import { IoAlertCircleOutline } from "react-icons/io5";
import {
  LuSend,
  LuPlus,
  LuLogOut,
  LuScale,
  LuUser,
  LuMenu,
  LuX,
  LuRefreshCw,
} from "react-icons/lu";

interface User {
  _id: string;
  username: string;
  email: {
    content: string;
    isVerified: boolean;
  };
}

interface Message {
  _id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
  isLoading?: boolean; // Optional for loading state
  isError?: boolean; // Optional for error state
}

interface Chat {
  _id: string;
  name: string;
  description?: string;
  lastMessage: string;
  createdAt: Date;
  messages: Message[];
  agent: {
    name: string;
  }
}



export default function ChatPage() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  // const [newChatDescription, setNewChatDescription] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [agent, setAgent] = useState<string>("");

  const router = useRouter();

  const userData: User | null =
    typeof window !== "undefined"
      ? (JSON.parse(localStorage.getItem("userData") || "null") as User | null)
      : null;
  // const agent =
  //   typeof window !== "undefined"
  //     ? localStorage.getItem("aiModel") ?? "LegalQwen3-7B"
  //     : "LegalQwen3-7B";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Get current chat messages
  const currentChat =
    chats.find((chat) => chat._id === currentChatId) || chats[0];
  // const messages = currentChat?.messages || [];

  // Scroll to bottom of messages

  
  function transformMessageContent( content: string, role: string = 'user', model = agent): string {
    let message = content;
    if(role === 'user') return message;
    console.log("test")
    if (model === "LegalQwen3-7B") {
      message = content
        .replaceAll('\\np', '\n')
        .replaceAll('\\n p', '\n')
        .replaceAll('\\n', '\n')
        .replace(/ol(\s)/g, '')
        .replaceAll('/li', '')
        .replace(/lip(?!\s)/g, '')
        .replace(/hr(\s)/g, '')
        .replace(/start\d+/g, '')
        .replaceAll('br />', '')
        .replaceAll('/div', '')
        .replaceAll('/dd', '')
        .replaceAll('/dp', '')
        .replaceAll('/>', '')
        .replaceAll('\\g', '\g')
        .replaceAll('li', '')
        .replaceAll('ul', '')
        .replaceAll('/p', '')
        .replaceAll('/strong', '</b>')
        .replace(/strong(?!\s)/g, '<b>')
        .replaceAll('/a', ']')
        .replaceAll('/s', '')
        .replaceAll('\\s', '\s')
        .replaceAll('\\t', '\t')
        .replaceAll('quot;', '')
        .replaceAll('amp;', '')
        .replaceAll(';', '; ')
        .replaceAll('/blockquote', '</b>')
        .replaceAll('blockquote', '<b class="p-4 rounded-md">')
        .replaceAll('a href', '[')
        .replaceAll('A href', '[')
        .replaceAll('body: p', '')
        .replaceAll('body:', '')
        .replaceAll('start[', '[')
        .replace(/em(.*?)\/em/g, '<em>$1</em>')
        .replace(/h([1-6])(.*?)\/h\1/g, (_, level, content) => {
          const size = parseInt(level);
          return `<h${level} class="text-${size}xl">${content}</h${level}>`;
        })
        .replace(/\/(\s)/g, '')
        .replace(/answerid:\s*\d+,\s*score:\s*\d+,?/gi, '');
    }
    if(model == "LegalDeepseek-R1-8B"){
      message = message
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') 
      .replace(/__(.*?)__/g, '<b>$1</b>')
      .replace(/^#{1,6}\s*(.+)$/gm, (match) => {
        const level = match?.match(/^#+/)?.[0]?.length; 
        const content = match.replace(/^#+\s*/, ''); 
        const size = level;
        return `<h${level} class="text-${size}xl">${content}</h${level}>`;
      }); 

      // eslint-disable-next-line prefer-const
      let [thinking, ...rest] = message.split('</think>')

      // put thinking variable in a blockquote
      thinking = `<i><blockquote class="p-4 rounded-md bg-gray-800 text-gray-200"><b>thinking...</b><br/>${thinking}
      </blockquote></i>`;
      message = [thinking, ...rest].join('')
    }
    if(model == "LegalDeepseek-R1-8B (summarization)"){
      message = message?.split('### OUTPUT:\n')?.[1] || message;
      message = message.replace(/(?:\s\d+)+\s*$/, '');
      message = message.replace(/(?:\d+;?)+\s*$/, '');
      // console.log("starting")
      message = message.replace(/(?:\d+;\s*)+$/, '');
      // console.log("ending")
    }
    console.log(model, model === 'LegalDeepseek-R1-8B (classification)')
    if(model == "LegalDeepseek-R1-8B (classification)"){
      console.log("test")
      message = message?.split('<｜Assistant｜>')?.[1] || message;
      message = message.replace(/:\/\/.*?\s/, '');
    }


    return message;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (currentChatId) {
      const chat = chats.find((chat) => chat._id === currentChatId);
      if (chat) {
        setAgent(chat.agent.name);
        setMessages(chat.messages.map((msg) => {
          return {
            ...msg,
            content: transformMessageContent(msg.content, msg.role, chat.agent.name),
          };
        }));
      } else {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, [currentChatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const replaceMessageContent = (messageId: string, content: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat._id === currentChatId) {
          return {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg._id === messageId ? { ...msg, content: transformMessageContent(content, msg.role) } : msg
            ),
          };
        }
        return chat;
      })
    );
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === messageId ? { ...msg, content: transformMessageContent(content, msg.role) } : msg
      )
    );
  }

  const deleteMessageLoadingState = (messageId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat._id === currentChatId) {
          return {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg._id === messageId ? { ...msg, isLoading: false } : msg
            ),
          };
        }
        return chat;
      })
    );
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === messageId ? { ...msg, isLoading: false } : msg
      )
    );
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !currentChat || !currentChatId) return;

    const newMessage: Message = {
      _id: Date.now().toString(),
      content: currentMessage,
      role: "user",
      createdAt: new Date(),
    };

    // Update the current chat's messages and last message
    const updatedChats = chats.map((chat) => {
      if (chat._id === currentChatId) {
        return {
          ...chat,
          messages: [...(chat?.messages || []), newMessage],
          lastMessage: newMessage.content,
          timestamp: new Date(),
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setCurrentMessage("");
    setIsSendingMessage(true);

    try {
      // Here you would add the API call to send the message
      // For now, we'll simulate a response

      const res = await sendMessage(currentChatId, currentMessage);

      if(!res.ok || !res.body) {
        const errorData = await res.json();
        const assistantMessage: Message = {
            _id: (Date.now() + 1000*Math.random()).toString(),
            content: errorData?.error?.message || "Failed to send message",
            role: "assistant",
            createdAt: new Date(),
            isError: true,
        };
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat._id === currentChatId) {
              return {
                ...chat,
                messages: [...(chat?.messages || []), assistantMessage],
                lastMessage: assistantMessage.content,
                timestamp: new Date(),
              };
            }
            return chat;
          })
        );
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        setCurrentMessage("");
        setIsSendingMessage(false);
        return;
      }

      const assistantMessage: Message = {
            _id: (Date.now() + 1000*Math.random()).toString(),
            content: "",
            role: "assistant",
            createdAt: new Date(),
            isLoading: true, // Set loading state to true initially
      };

      setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat._id === currentChatId) {
              return {
                ...chat,
                messages: [...(chat?.messages || []), assistantMessage],
                lastMessage: assistantMessage.content,
                timestamp: new Date(),
              };
            }
            return chat;
          })
        );
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      setCurrentMessage("");
      setIsSendingMessage(false);


      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        replaceMessageContent(assistantMessage._id, buffer);
      }

      deleteMessageLoadingState(assistantMessage._id);
      // setTimeout(() => {
          // const assistantMessage: Message = {
          //   _id: (Date.now() + 1000*Math.random()).toString(),
          //   content: "",
          //   role: "assistant",
          //   createdAt: new Date(),
          //   isLoading: true,
          // };

      //     setChats((prevChats) =>
      //       prevChats.map((chat) => {
      //         if (chat._id === currentChatId) {
      //           return {
      //             ...chat,
      //             messages: [...(chat?.messages || []), assistantMessage],
      //             lastMessage: assistantMessage.content,
      //             timestamp: new Date(),
      //           };
      //         }
      //         return chat;
      //       })
      //     );
      //     setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      //     setIsSendingMessage(false);


      //     const words = ["hi", "i", "am", "an", "ai", "assistant"];
      //     let i = 0;
      //     const interval = setInterval(() => {
      //       if (i < words.length) {
      //         appendMessageTokens(assistantMessage._id, words[i] + " ");
      //         i++;
      //       } else {
      //         clearInterval(interval);
      //         deleteMessageLoadingState(assistantMessage._id);
      //       }
      //     }, 500);
      // }, 1000);
    } catch {
      setError("Failed to send message. Please try again.");
      setIsSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateNewChat = async () => {
    if (!newChatTitle.trim()) return;

    setIsCreatingChat(true);
    setError(null);

    try {
      const newChat = await startNewChat(localStorage?.getItem('aiModel') || agent,
        newChatTitle.trim(),
      );

      if (newChat.error) {
        throw new Error(newChat.error);
      }

      // Update the chat with the title and description
      // In a real app, you would send this to the API
      const enhancedChat = {
        ...newChat.data,
        name: newChatTitle,
        messages: [],
        agent: {
          name: localStorage?.getItem('aiModel'),
        }
      };

      setChats([...chats , enhancedChat]);
      setAgent(localStorage?.getItem('aiModel') || agent);
      setCurrentChatId(enhancedChat._id);
      setNewChatTitle("");
      // setNewChatDescription("");
      setIsNewChatModalOpen(false);
    } catch {
      setError("Failed to create new chat");
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // On mobile, close the sidebar after selecting a chat
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const refreshChats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAllChats();
      if (result.error) {
        throw new Error(result.error);
      }
      setChats(result.data);

      // Select the first chat if none is selected
      if (result.data.length > 0 && !currentChatId) {
        setCurrentChatId(result.data[0].id);
      }
    } catch {
      setError("Failed to load chats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshChats();
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);

    // If the message is from today, show only time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If the message is from this year, show month and day
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }

    // Otherwise show full date
    return messageDate.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-screen flex bg-gray-10">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0 md:w-0"
        } transition-all duration-300 overflow-hidden bg-gray-90 border-r-1 border-gray-100 flex flex-col fixed md:relative h-full z-10`}
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
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-30">Recent Chats</h3>
            <Tooltip content="Refresh chats">
              <button
                onClick={refreshChats}
                className="text-gray-40 hover:text-gray-30 transition-colors"
                disabled={isLoading}
              >
                <LuRefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </Tooltip>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 p-4 bg-gray-80 rounded-md">
              <IoAlertCircleOutline className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm">{error}</p>
              <CustomButton
                className="mt-2 text-xs"
                variant="bordered"
                onClick={refreshChats}
              >
                Try Again
              </CustomButton>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.length > 0 ? (
                chats.toReversed().map((chat) => {
                  return (
                    <div
                      key={chat._id}
                      className={`cursor-pointer transition-colors p-3 rounded-md ${
                        currentChatId === chat._id
                          ? "border-l-4 border-l-primary-60 bg-gray-80"
                          : "hover:bg-gray-80"
                      }`}
                      onClick={() => handleSelectChat(chat._id)}
                    >
                      <h4 className="font-medium text-gray-30 text-sm truncate">
                        {chat.name || "Untitled Chat"}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-accent-50 mt-1">
                        <span className="bg-gray-70 px-2 py-0.5 rounded-full">
                          {chat?.agent?.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-50 mt-1">
                        {chat.createdAt
                          ? formatDate(new Date(chat.createdAt))
                          : "No messages yet"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-50 p-6 bg-gray-80 rounded-md">
                  <p>No chats found</p>
                  <p className="text-xs mt-2">
                    Create a new chat to get started
                  </p>
                  <CustomButton
                    className="mt-4 text-sm"
                    onClick={() => setIsNewChatModalOpen(true)}
                    startContent={<LuPlus className="w-4 h-4" />}
                  >
                    New Chat
                  </CustomButton>
                </div>
              )}
            </div>
          )}
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
                <div className="flex items-center gap-1">
                  <p className="text-xs text-gray-50">
                    {userData.email.content}
                  </p>
                  {userData.email.isVerified ? (
                    <span className="text-xs text-accent-50">✓</span>
                  ) : (
                    <span className="text-xs text-red-400">!</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <CustomButton
              variant="bordered"
              className="flex-1 border-accent-50 text-accent-50 hover:bg-accent-50 hover:text-white transition-colors"
              startContent={<LuLogOut className="w-4 h-4" />}
              fullWidth
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                window.location.href = "/login";
              }}
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
          <button
            className="md:hidden text-gray-30 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <LuX className="w-5 h-5" />
            ) : (
              <LuMenu className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center gap-3">
            {currentChat ? (
              <div>
                <h2 className="font-medium">
                  {currentChat?.name || "Untitled Chat"}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-accent-50">Online</span>
                  <span className="text-xs bg-gray-60 px-2 py-0.5 rounded-full">
                    {currentChat?.agent?.name}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <h2
                  className="font-medium cursor-pointer hover:text-primary-50 transition-colors"
                  onClick={() => setIsNewChatModalOpen(true)}
                >
                  {isLoading ? "Loading chats..." : "Select or create a chat"}
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-gray-70 overflow-y-auto p-4 space-y-4">
          {currentChat ? (
            messages.length > 0 ? (
              <>
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    } ${message.isLoading ? "opacity-50" : ""} ${message.isError ? "bg-red-900/20 opacity-50" : ""}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[70%] ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar
                        className="w-8 h-8 flex-shrink-0"
                        fallback={
                          message.role === "user" ? (
                            <LuUser className="w-4 h-4" />
                          ) : (
                            <FaBrain className="w-4 h-4" />
                          )
                        }
                      />
                      <div
                        className={`${
                          message.role === "user"
                            ? "bg-gradient-to-r from-primary-60 to-primary-70 text-white"
                            : "bg-gray-20 text-gray-90"
                        } rounded-2xl px-4 py-3`}
                      >
                        <div className="text-sm whitespace-pre-wrap" style={{whiteSpace: "pre-wrap"}}   dangerouslySetInnerHTML={{ __html: message.content }}
>
                          {/* {message.content} */}
                        </div>
                        <span
                          className={`text-xs mt-1 block ${
                            message.role === "user"
                              ? "text-primary-10"
                              : "text-gray-60"
                          }`}
                        >
                          {formatDate(new Date(message.createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {isSendingMessage && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <Avatar
                        className="w-8 h-8 flex-shrink-0"
                        fallback={<FaBrain className="w-4 h-4" />}
                      />
                      <div className="bg-gray-20 text-gray-90 rounded-2xl px-4 py-3">
                        <div className="flex space-x-2">
                          <div
                            className="w-2 h-2 bg-gray-60 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-60 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-60 rounded-full animate-bounce"
                            style={{ animationDelay: "600ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-60 to-secondary-60 rounded-full flex items-center justify-center mb-4">
                  <FaBrain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-40 max-w-md">
                  Ask a question or start a conversation with the AI assistant.
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-60 to-secondary-60 rounded-full flex items-center justify-center mb-4">
                <LuScale className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                Welcome to Legal Fusion AI
              </h3>
              <p className="text-gray-40 max-w-md">
                {isLoading
                  ? "Loading your chats..."
                  : chats.length > 0
                  ? "Select a chat from the sidebar or create a new one to get started."
                  : "Create a new chat to start a conversation with the AI assistant."}
              </p>
              {!isLoading && chats.length === 0 && (
                <CustomButton
                  className="mt-4"
                  onClick={() => setIsNewChatModalOpen(true)}
                  startContent={<LuPlus className="w-4 h-4" />}
                >
                  New Chat
                </CustomButton>
              )}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-gray-70 border-t-1 border-gray-50 p-4">
          <div className="flex gap-3 items-end">
            <CustomInput
              placeholder={
                currentChat
                  ? "Type your message..."
                  : "Select a chat to start messaging"
              }
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!currentChat || isSendingMessage}
            />
            <CustomButton
              onClick={handleSendMessage}
              disabled={
                !currentMessage.trim() || !currentChat || isSendingMessage
              }
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
              {
                /*
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
                */
              }
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-700 rounded-md text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="border-t-1 border-gray-70">
            <CustomButton
              variant="bordered"
              className="border-gray-50 text-gray-40"
              onClick={() => {
                setIsNewChatModalOpen(false);
                setError(null);
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              className="bg-gradient-to-r from-primary-60 to-primary-70 text-white"
              onClick={handleCreateNewChat}
              disabled={!newChatTitle.trim() || isCreatingChat}
            >
              {isCreatingChat ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Create Chat"
              )}
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
