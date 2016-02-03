var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dealSchema = new Schema({
    hands: {
            east: {type: Array, required: true},
            west: {type: Array, required: true},
        },
    contracts: {type: Object, required: true},
    //summary values
    hcpEast: Number,
    hcpWest: Number,
    hcpTotal: Number,
    best: Number,
    good: Number,
    fair: Number,
    diff: Number,
    spadesEast: Number,
    heartsEast: Number,
    diamondsEast: Number,
    clubsEast: Number,
    spadesWest: Number,
    heartsWest: Number,
    diamondsWest: Number,
    clubsWest: Number,
    spadesTotal: Number,
    heartsTotal: Number,
    diamondsTotal: Number,
    clubsTotal: Number,
}
)
module.exports = mongoose.model('Deal',dealSchema);