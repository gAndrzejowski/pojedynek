var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dealSchema = new Schema({
    hands: {
            east: {type: Array, required: true},
            west: {type: Array, required: true},
        },
    contracts: {type: Object, required: true},
    hcp: {
        east: Number,
        west: Number
        },
    best: Number,
    good: Number,
    fair: Number
}
)
module.exports = mongoose.model('Deal',dealSchema);