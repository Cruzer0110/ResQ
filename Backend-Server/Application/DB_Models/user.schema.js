const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: false
        },
        email: {
            type: String,
            required: false,
            unique: true
        },
        contact: {
            type: Number,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
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
        location: {
            latitude: {
                type: String,
                required: false
            },
            longitude: {
                type: String,
                required: false
            },
        },
        role: {
            type: String,
            required: true
        },
        agency: {
            type: String,
            required: false
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