const {Schema, model} = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const ArtistSchema = Schema({
    name: {
        type: String,
        require: true
    },
    description: String,
    image: {
        type: String,
        default: "default.png"
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

ArtistSchema.plugin(mongoosePaginate);

module.exports = model("Artist", ArtistSchema, "artists");