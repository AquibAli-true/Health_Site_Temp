const mongoose = require('mongoose')

const commonFields = {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 130,
    },
    sex: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    weight: {
        type: Number,
        min: 0,
        max: 650,
        required: true
    },
    height: {
        type: Number,
        min: 0,
        max: 250,
        required: true
    }
};

const userSchema = new mongoose.Schema({
    ...commonFields
}, {
    timestamps: true
}
)

const pendingUser = new mongoose.Schema({
    ...commonFields,
    expiresAt: {
        type: Date,
        required: true
    },

}
)

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true
    },
    pendingUserId: {
        type: String,
        required: true
    }
})

pendingUser.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
)
otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
)



const userModel = mongoose.model('user', userSchema)
const pendingUserModel = mongoose.model('pendingUser', pendingUser);
const otpModel = mongoose.model('otpModel', otpSchema);

module.exports = {
    userModel,
    pendingUserModel,
    otpModel,
};