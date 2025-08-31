import { useState } from "react";
import { formatMessagetime } from "../lib/utils";
import { shouldCensorMessage } from "../lib/censor";

function MessageBubble({ message, authUser, selectedUser, messageEndRef }) {
  const isSender = message.senderId == authUser._id;
  const [isBlurred, setIsBlurred] = useState(
    !isSender && message.text ? shouldCensorMessage(message.text) : false
  );

  return (
    <div
      className={`chat ${
        message.senderId === authUser._id ? "chat-end" : "chat-start"
      }`}
      ref={messageEndRef}
    >
      {/* Avatar */}
      <div className="chat-image avatar">
        <div className="size-10 rounded-full border">
          <img
            src={
              message.senderId === authUser._id
                ? authUser.profilePic || "/avatar.png"
                : selectedUser.profilePic || "/avatar.png"
            }
            alt="profile pic"
          />
        </div>
      </div>

      {/* Time */}
      <div className="chat-header mb-1">
        <time className="text-xs opacity-50 ml-1">
          {formatMessagetime(message.createdAt)}
        </time>
      </div>

      {/* Bubble */}
      <div className="chat-bubble relative flex flex-col">
        {message.image && (
          <img
            src={message.image}
            alt="Attachment"
            className="sm:max-w-[200px] rounded-md mb-2"
          />
        )}

        {/* Text */}
        {message.text && (
          <p
            className={`transition duration-200 ${
              isBlurred ? "blur-sm select-none" : ""
            }`}
          >
            {isBlurred}
            {message.text}
          </p>
        )}

        {/* Unblur Button */}
        {isBlurred && (
          <button
            onClick={() => setIsBlurred(false)}
            className="absolute bottom-1 right-1 text-[10px] px-2 py-0.5 
                       rounded bg-gray-800 text-white opacity-70 hover:opacity-100"
          >
            Unblur
          </button>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
