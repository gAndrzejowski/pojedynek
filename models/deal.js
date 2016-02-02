var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dealSchema = new Schema({
    hands: {
            east: Array,
            west: Array
        },
    contracts: Object,
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