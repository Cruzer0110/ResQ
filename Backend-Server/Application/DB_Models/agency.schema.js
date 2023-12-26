// Used for creating the schema for the agency collection in the database
const mongoose = require("mongoose");

//Create mongoose model for database
const agencySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            enum: ['Fire', 'Police', 'Medical', 'Other'],
            required: true
        },
        contact: {
            type: Number,
            required: true,
            unique: true
        },
        expertise: {
            type: String,
            required: () => this.type === 'Medical'
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
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    { timestamps: true }
);

agencySchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Agency = mongoose.model("agency", agencySchema);

module.exports = Agency;