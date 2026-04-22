import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Clock,
  Shield,
} from "lucide-react";

interface Conversation {
  id: string;
  participantOne: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isVerifiedSeller: boolean;
  };
  participantTwo: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isVerifiedSeller: boolean;
  };
  lastMessage?: string;
  lastMessageAt?: string;
}

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with API calls
  useEffect(() => {
    // Simulate fetching conversations
    setConversations([
      {
        id: "1",
        participantOne: {
          id: "user1",
          firstName: "Ahmed",
          lastName: "Al Mazrouei",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop",
          isVerifiedSeller: true,
        },
        participantTwo: {
          id: "user2",
          firstName: "You",
          lastName: "Buyer",
          isVerifiedSeller: false,
        },
        lastMessage: "Is the car still available?",
        lastMessageAt: "2 hours ago",
      },
      {
        id: "2",
        participantOne: {
          id: "user3",
          firstName: "Fatima",
          lastName: "Al Mansoori",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop",
          isVerifiedSeller: true,
        },
        participantTwo: {
          id: "user2",
          firstName: "You",
          lastName: "Buyer",
          isVerifiedSeller: false,
        },
        lastMessage: "Perfect! Let's arrange a viewing tomorrow",
        lastMessageAt: "1 day ago",
      },
    ]);
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageToAdd = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: "user2",
        firstName: "You",
        lastName: "Buyer",
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, messageToAdd]);
    setNewMessage("");

    // Simulate API call - replace with actual API
    setIsLoading(true);
    try {
      // const response = await fetch("/api/messages", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     content: messageToAdd.content,
      //     receiverId: selectedConversation.participantOne.id,
      //     listingId: "listing_id", // Would need to be passed
      //   }),
      // });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Mock messages
    setMessages([
      {
        id: "1",
        content: "Hi, is this 2023 Toyota Land Cruiser still available?",
        sender: {
          id: "user2",
          firstName: "You",
          lastName: "Buyer",
        },
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        content: "Yes, it's available! Excellent condition with full service history.",
        sender: {
          id: conversation.participantOne.id,
          firstName: conversation.participantOne.firstName,
          lastName: conversation.participantOne.lastName,
        },
        isRead: true,
        createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        content: "Can I arrange a viewing this weekend?",
        sender: {
          id: "user2",
          firstName: "You",
          lastName: "Buyer",
        },
        isRead: true,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ]);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-6 h-[calc(100vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* Conversations List */}
            <div className="md:col-span-1 bg-card border border-border rounded-lg flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-border">
                <h2 className="text-xl font-bold mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full rounded-lg border border-border bg-muted pl-10 pr-4 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`w-full text-left p-4 border-b border-border hover:bg-muted transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "bg-muted"
                          : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              conversation.participantOne.avatar ||
                              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
                            }
                            alt={conversation.participantOne.firstName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          {conversation.participantOne.isVerifiedSeller && (
                            <div className="absolute bottom-0 right-0 bg-success rounded-full p-0.5">
                              <Shield className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-sm truncate">
                              {conversation.participantOne.firstName}{" "}
                              {conversation.participantOne.lastName}
                            </h3>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {conversation.lastMessageAt}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="md:col-span-2 bg-card border border-border rounded-lg flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          selectedConversation.participantOne.avatar ||
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
                        }
                        alt={selectedConversation.participantOne.firstName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">
                          {selectedConversation.participantOne.firstName}{" "}
                          {selectedConversation.participantOne.lastName}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {selectedConversation.participantOne.isVerifiedSeller && (
                            <>
                              <Shield className="h-3 w-3 text-success" />
                              <span>Verified Seller</span>
                            </>
                          )}
                          <Clock className="h-3 w-3 ml-2" />
                          <span>Responds in 1 hour</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender.id === "user2"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.sender.id === "user2"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (
                            e.key === "Enter" &&
                            !e.shiftKey &&
                            !isLoading
                          ) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 rounded-lg border border-border bg-muted px-4 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !newMessage.trim()}
                        className="btn-primary gap-2 px-4"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
