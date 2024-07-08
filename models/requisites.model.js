const mongoose = require("mongoose");

const RequisitesSchema = mongoose.Schema({
  reqId: {
    type: String,
    require: [true],
  },
});

const Requisite = mongoose.model("Requisites", RequisitesSchema);

module.exports = Requisite;
