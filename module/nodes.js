//栏目模型

const mongoose = require('mongoose');
const nodesSchema = require('../schemas/nodes');



let Nodes = mongoose.model('Nodes',nodesSchema);

module.exports = Nodes;