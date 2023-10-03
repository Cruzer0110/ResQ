// Used for creating the schema for the agency collection in the database

const { Decimal128 } = require("mongodb");

//Create mongoose model for database
module.exports = mongoose => {
    let schema = mongoose.Schema(
        {
            name: String,
            type: String,
            contact: Number,
            expertise: String,
            address: {
                street: String,
                city: String,
                state: String,
                pin: Number
            },
            location: {
                latitude: Decimal128,
                longitude: Decimal128,
            }
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    
    const Agency = mongoose.model("agency", schema);
    return Agency;
};