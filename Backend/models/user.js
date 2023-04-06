const mongoose = require("mongoose");
const {Schema} = require("mongoose");


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    zipCode: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }

})

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model("User", userSchema);