// Used for creating the schema for the user collection in the database
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        firebaseID: {
            type: String,
            required: [true, "Unique firebase ID is required"],
            unique: true
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            unique: false
        },
        contact: {
            type: Number,
            required: [true, "Unique phone number is required"],
            unique: true
        },
        email: {
            type: String,
            required: [true, "Unique email id is required"],
            unique: true
        },
        address: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            pin: {
                type: Number,
                required: true
            }
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'agency'],
            required: true
        },
        agency: {
            type: String,
            ref: 'agency',
            required: () => this.role === 'agency'
        }
    },
    { timestamps: true }
);

userSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const User = mongoose.model("user", userSchema);

module.exports = User;