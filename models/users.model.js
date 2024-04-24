const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema({
  userChatId: {
    type: String,
    require: [true, "please enter user's chatId"],
  },
});

const User = mongoose.model("User", UsersSchema);

module.exports = User;
