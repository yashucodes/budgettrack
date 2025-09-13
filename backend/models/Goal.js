const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  target: { type: Number, required: true },
  deadline: { type: Date, required: true },
  completed: { type: Boolean, default: false },  // ✅ new field
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Goal", GoalSchema);
