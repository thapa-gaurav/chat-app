import BlockedUser from "../models/blockedUser.model.js";

export const blockUser = async (req, res) => {
  try {
    const blockerId = req.user._id; // logged-in user
    const { userId } = req.params; // user to block

    if (blockerId.toString() === userId) {
      return res.status(400).json({ message: "You cannot block yourself." });
    }

    const block = new BlockedUser({ blockerId, blockedId: userId });
    await block.save();

    res.json({ message: "User blocked successfully." });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User is already blocked." });
    }
    res.status(500).json({ message: error.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const blockerId = req.user._id;
    const { userId } = req.params;

    await BlockedUser.findOneAndDelete({ blockerId, blockedId: userId });

    res.json({ message: "User unblocked successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlockedUsers = async (req, res) => {
  try {
    const blockerId = req.user._id;
    const blocked = await BlockedUser.find({ blockerId }).populate(
      "blockedId",
      "fullName email profilePic"
    );

    res.json(blocked.map((b) => b.blockedId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkBlockStatus = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  const isBlocked = await BlockedUser.findOne({
    $or: [
      { blockerId: currentUserId, blockedId: userId },
      { blockerId: userId, blockedId: currentUserId },
    ],
  });

  res.json({ isBlocked: !!isBlocked });
};
