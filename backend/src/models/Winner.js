import mongoose from "mongoose";

const winnerSchema = new mongoose.Schema(
  {
    winnerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    productName: { type: String, trim: true, default: "" },
    prizeName: { type: String, required: true, trim: true },
    drawDate: { type: Date, required: true, default: Date.now },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      default: null,
    },
  },
  { timestamps: true }
);

export const Winner = mongoose.model("Winner", winnerSchema);
