// Used for creating the schema for the agency collection in the database
const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

//Create mongoose model for database
let agency = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: true,
            unique: true
        },
        expertise: {
            type: String,
            required: false
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
                type: String,
                required: true
            }
        },
        location: {
            latitude: {
                type: Decimal128,
                required: false
            },
            longitude: {
                type: Decimal128,
                required: false
            },
        }
    },
    { timestamps: true }
);

agency.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Agency = mongoose.model("agency", agency);

module.exports = Agency;