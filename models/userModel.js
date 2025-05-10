import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    mobile: {
        type:String,
        required: true
    },
    image: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    is_admin: {
        type:Boolean,
        required: true
    },
    is_verified: {
        type:Boolean,
    },
    token: {
        type: String,
        default: ''
    }
})

export const User = mongoose.model('User', userSchema)