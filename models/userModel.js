import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    mobile: {
        type:String,
    },
    image: {
        type:String,
    },
    password: {
        type:String,
        required: true
    },
    is_admin: {
        type:Boolean,
        default: false,
    },
    is_verified: {
        type:Boolean,
        default: false
    },
    token: {
        type: String,
        default: ''
    }
})

export const User = mongoose.model('User', userSchema)