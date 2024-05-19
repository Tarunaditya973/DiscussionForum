const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

// Add a virtual field to populate the 'username' from the referenced 'User' model
threadSchema.virtual("username", {
  ref: "User",
  localField: "owner",
  foreignField: "_id",
  justOne: true,
});

// Set 'toObject' option to include virtuals when converting to JSON
threadSchema.set("toObject", { virtuals: true });

const Thread = mongoose.model("Thread", threadSchema);
module.exports = Thread;
