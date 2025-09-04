import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { encryptAES, decryptAES } from "../lib/aesHelper.js";
import BlockedUser from "../models/blockedUser.model.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSideBar: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const encryptedMessages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });
    const decryptedMessages = encryptedMessages.map((msg) => {
      try {
        let decryptedText;
        if (msg.encryptedText && msg.encryptionKey && msg.iv) {
          decryptedText = decryptAES(
            msg.encryptedText,
            msg.encryptionKey,
            msg.iv
          );
        }
        return {
          _id: msg._id,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          encodedText: decryptedText || null,
          image: msg.image || null,
          huffmanTree: msg.huffmanTree,
          createdAt: msg.createdAt,
          encrypted: true,
        };
      } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        return {
          _id: msg._id,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          // text: "[Decryption failed]",
          createdAt: msg.createdAt,
          decryptionError: true,
        };
      }
    });
    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { encodedText, huffmanTree, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const isBlocked = await BlockedUser.findOne({
      $or: [
        { blockerId: senderId, blockedId: receiverId },
        { blockerId: receiverId, blockedId: senderId },
      ],
    });

    if (isBlocked) {
      return res
        .status(403)
        .json({ message: "Messaging is blocked between these users." });
    }

    let encrypted, AES_KEY, IV;

    if (encodedText) {
      const encryptionResult = encryptAES(encodedText);
      encrypted = encryptionResult.encrypted;
      AES_KEY = encryptionResult.AES_KEY;
      IV = encryptionResult.IV;
    }
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      encryptedText: encrypted,
      huffmanTree,
      encryptionKey: AES_KEY,
      iv: IV,
      image: imageUrl,
    });

    await newMessage.save();

    // const receiverSocketId = getReceiverSocketId(receiverId);
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("newMessage", newMessage);
    // }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      let outgoingMessage;
      outgoingMessage = {
        _id: newMessage._id,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        encodedText: encodedText || null,
        image: newMessage.image,
        huffmanTree: newMessage.huffmanTree,
        createdAt: newMessage.createdAt,
      };
      io.to(receiverSocketId).emit("newMessage", outgoingMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
