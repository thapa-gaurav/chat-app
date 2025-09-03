import mongoose from "mongoose";

const blockedUserSchema = new mongoose.Schema(
  {
    blockerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

blockedUserSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

export default mongoose.model("BlockedUser", blockedUserSchema);
