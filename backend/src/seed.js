import "dotenv/config";
import { connectDb } from "./db.js";
import { Submission } from "./models/Submission.js";
import { Winner } from "./models/Winner.js";
import mongoose from "mongoose";

async function run() {
  await connectDb();
  await Submission.deleteMany({ receiptNumber: /^ZZ99/ });
  await Winner.deleteMany({ winnerName: /^__dummy__/ });

  const samples = [
    {
      receiptNumber: "ZZ99000001",
      totalAmount: 125000,
      fullName: "",
      productName: "",
      phone: "99110011",
      email: "bat@example.com",
      receiptImage: "https://picsum.photos/seed/receipt1/400/300",
      status: "approved",
    },
    {
      receiptNumber: "ZZ99000002",
      totalAmount: 45000,
      fullName: "",
      productName: "",
      phone: "99220022",
      email: "",
      receiptImage: "https://picsum.photos/seed/receipt2/400/300",
      status: "pending",
    },
  ];
  await Submission.insertMany(samples);

  await Winner.create({
    winnerName: "Энхтүшиг",
    phone: "88112233",
    productName: "Урамшууллын бүтээгдэхүүн Г",
    prizeName: "Honor Choice брэндийн чихэвч – 400,000₮",
    drawDate: new Date("2026-03-15"),
  });

  console.log("Seed completed (dummy submissions + one winner).");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
