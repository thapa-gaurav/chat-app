import { X, ShieldBan, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/usechatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, unblockUser, blockUser, isBlocked } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleToggleBlock = async () => {
    if (!selectedUser) return;
    if (isBlocked) {
      await unblockUser(selectedUser._id);
    } else {
      await blockUser(selectedUser._id);
    }
  };

  return (
    <div className="p-3 border-b border-base-300 bg-base-200">
      <div className="flex items-center justify-between">
        {/* Left Side: Avatar + Info */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="rounded-full border border-base-300"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-base-content">
              {selectedUser.fullName}
            </h3>
            <p
              className={`text-sm ${
                onlineUsers.includes(selectedUser._id)
                  ? "text-green-500"
                  : "text-zinc-400"
              }`}
            >
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex items-center gap-2">
          {selectedUser && (
            <button
              onClick={handleToggleBlock}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                isBlocked
                  ? "bg-base-300 text-base-content hover:bg-base-100"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isBlocked ? (
                <>
                  <ShieldCheck size={16} /> Unblock
                </>
              ) : (
                <>
                  <ShieldBan size={16} /> Block
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setSelectedUser(null)}
            className="p-2 rounded-full bg-base-300 hover:bg-base-100 transition"
          >
            <X size={18} className="text-base-content" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
