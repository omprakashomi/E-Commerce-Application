const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const categorySchema = new Schema({
    name: {
        type: String,
        require: true
    },
    color: {
        type: String,
    },
    icon: {
        type: String,
    }
})

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});
categorySchema.set('toJSON', {
    virtuals: true,
});

exports.Category = mongoose.model("Category", categorySchema);