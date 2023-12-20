/*
    This is the Database schema for the location log collection of the database which stores all of the location data fetched from the user's device.
*/

const mongoose = require('mongoose');
const Decimal128 = mongoose.Types.Decimal128;

const locationLogSchema = mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Decimal128],
                required: true
            }
        },
        timestamp: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
);

locationLogSchema.method("toJSON", function () {
    const { __v, ...object } = this.toObject();
    return object;
});

const LocationLog = mongoose.model("locationLog", locationLogSchema);

module.exports = LocationLog;