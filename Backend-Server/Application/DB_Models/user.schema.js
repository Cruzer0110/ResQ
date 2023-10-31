// Used for creating the schema for the user collection in the database
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            unique: false
        },
        email: {
            type: String,
            required: [true, "Unique email id is required"],
            unique: true
        },
        contact: {
            type: Number,
            required: [true, "Unique phone number is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            unique: false
        },
        address: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: false
            },
            state: {
                type: String,
                required: false
            },
            pin: {
                type: Number,
                required: false
            }
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'agency'],
            required: true
        },
        agency: {
            type: String,
            required: () => this.role === 'agency'
        }
    },
    { timestamps: true }
);

userSchema.method("toJSON", () => {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const User = mongoose.model("user", userSchema);

module.exports = User;