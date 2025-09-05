import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { huffmanDecode, huffmanEncode } from "../lib/huffman";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isBlocked: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      console.log(res.data);
      const decoded = res.data.map((msg) => ({
        ...msg,
        text: msg.encodedText
          ? huffmanDecode(msg.encodedText, msg.huffmanTree)
          : null,
      }));
      console.log(decoded);
      set({ messages: decoded });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    // console.log(messages);
    try {
      let payload = { ...messageData };
      if (messageData.text) {
        const { encoded, tree } = huffmanEncode(messageData.text);
        payload = {
          ...messageData,
          encodedText: encoded,
          huffmanTree: tree,
          text: undefined,
        };
      }
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        payload
      );

      // const decoded = res.data.encodedText
      //   ? huffmanDecode(res.data.encodedText, res.data.huffmanTree)
      //   : null;

      set({ messages: [...messages, { ...res.data, text: messageData.text }] });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },
  blockUser: async (userId) => {
    // const { isBlocked } = get();
    try {
      await axiosInstance.post(`/users/block/${userId}`);
      set({ isBlocked: true });
      toast.success("User blocked");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  unblockUser: async (userId) => {
    // const { checkBlockStatus } = get();
    try {
      await axiosInstance.post(`/users/unblock/${userId}`);
      set({ isBlocked: false });
      toast.success("User unblocked");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  checkBlockStatus: async (userId) => {
    try {
      const res = await axiosInstance.get(`/users/block-status/${userId}`);
      set({ isBlocked: res.data.isBlocked });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    const myId = useAuthStore.getState().authUser?._id;

    socket.on("newMessage", (newMessage) => {
      const decoded = newMessage.encodedText
        ? huffmanDecode(newMessage.encodedText, newMessage.huffmanTree)
        : null;

      if (selectedUser && newMessage.senderId === selectedUser._id) {
        set({
          messages: [...get().messages, { ...newMessage, text: decoded }],
        });
      } else if (newMessage.senderId !== myId) {
        toast.success(`📩 New message from ${newMessage.senderName}`, {
          position: "top-right",
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
