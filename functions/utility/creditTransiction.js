const CreditTransaction = require("../models/Credits");
const { User } = require("../models/User");

const createTransaction = async (
  areaOfUse,
  senderId,
  recieverId,
  amount,
  status,
  eventId
) => {
  try {
    // Validate required fields
    if (
      !areaOfUse ||
      !["video", "image", "pdf", "transfer"].includes(areaOfUse)
    ) {
      throw new Error("Invalid area of use");
    }
    if (!senderId || !amount) {
      throw new Error("Missing required fields");
    }

    if (!status || !["pending", "rejected", "completed"].includes(status)) {
      throw new Error("Missing status of transaction");
    }

    // Create a new transaction
    const transaction = new CreditTransaction({
      areaOfUse,
      senderId,
      recieverId,
      eventId,
      amount,
      status,
      transactionDate: new Date(),
    });

    // Save the transaction to the database
    const res1 = await transaction.save();
    if (!res1) throw new Error("credit history not created");

    const res2 = await User.updateOne(
      { _id: senderId },
      {
        $inc: { credits: -amount },
      }
    );
    if (!res2) throw new Error("Credits not cut");

    // Return the saved transaction
    return transaction;
  } catch (error) {
    return error;
  }
};

module.exports = createTransaction;
