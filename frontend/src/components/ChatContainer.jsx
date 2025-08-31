import { useEffect, useRef } from "react";
import { useChatStore } from "../store/usechatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
// import { formatMessagetime } from "../lib/utils";
// import { shouldCensorMessage } from "../lib/censor";
import MessageBubble from "./MessageBubble";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          authUser={authUser}
          selectedUser={selectedUser}
          messageEndRef={messageEndRef}
        />
      ))}
      <MessageInput />
    </div>
  );
  //  (
  //   <div className="flex-1 overflow-y-auto p-4 space-y-4">
  //     {messages.map((message) => {
  //       const [isBlurred, setIsBlurred] = useState(
  //         message.text ? shouldCensorMessage(message.text) : false
  //       );

  //       return (
  //         <div
  //           key={message._id}
  //           className={`chat ${
  //             message.senderId === authUser._id ? "chat-end" : "chat-start"
  //           }`}
  //           ref={messageEndRef}
  //         >
  //           {/* Avatar */}
  //           <div className="chat-image avatar">
  //             <div className="size-10 rounded-full border">
  //               <img
  //                 src={
  //                   message.senderId === authUser._id
  //                     ? authUser.profilePic || "/avatar.png"
  //                     : selectedUser.profilePic || "/avatar.png"
  //                 }
  //                 alt="profile pic"
  //               />
  //             </div>
  //           </div>

  //           {/* Time */}
  //           <div className="chat-header mb-1">
  //             <time className="text-xs opacity-50 ml-1">
  //               {formatMessagetime(message.createdAt)}
  //             </time>
  //           </div>

  //           {/* Bubble */}
  //           <div className="chat-bubble relative flex flex-col">
  //             {message.image && (
  //               <img
  //                 src={message.image}
  //                 alt="Attachment"
  //                 className="sm:max-w-[200px] rounded-md mb-2"
  //               />
  //             )}

  //             {/* Text */}
  //             {message.text && (
  //               <p
  //                 className={`transition duration-200 ${
  //                   isBlurred ? "blur-sm select-none" : ""
  //                 }`}
  //               >
  //                 {message.text}
  //               </p>
  //             )}

  //             {/* Toggle Button */}
  //             {isBlurred && (
  //               <button
  //                 onClick={() => setIsBlurred(false)}
  //                 className="absolute bottom-1 right-1 text-[10px] px-2 py-0.5
  //                            rounded bg-gray-800 text-white opacity-70 hover:opacity-100"
  //               >
  //                 Unblur
  //               </button>
  //             )}
  //           </div>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
};

export default ChatContainer;
