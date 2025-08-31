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
        console.log(messageData.text);
        const { encoded, tree } = huffmanEncode(messageData.text);
        payload = {
          ...messageData,
          encodedText: encoded,
          huffmanTree: tree,
          text: undefined,
        };
        console.log(payload);
      }
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        payload
      );

      const decoded = res.data.encodedText
        ? huffmanDecode(res.data.encodedText, res.data.huffmanTree)
        : null;

      set({ messages: [...messages, { ...res.data, text: decoded }] });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      const decoded = newMessage.encodedText
        ? huffmanDecode(newMessage.encodedText, newMessage.huffmanTree)
        : null;

      set({
        messages: [...get().messages, { ...newMessage, text: decoded }],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
