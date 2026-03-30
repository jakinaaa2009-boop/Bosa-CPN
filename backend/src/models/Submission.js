import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    /** НӨАТ баримтын дугаар, жишээ нь AA00000000 */
    receiptNumber: { type: String, trim: true, default: "" },
    /** Үнийн дүн (төгрөг) */
    totalAmount: { type: Number, default: null },
    /** Legacy */
    fullName: { type: String, trim: true, default: "" },
    productName: { type: String, trim: true, default: "" },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    receiptImage: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", submissionSchema);
