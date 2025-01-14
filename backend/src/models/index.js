// This file defines the data models used in the application, exporting them for use in controllers.

const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
});

const ExampleModel = mongoose.model('Example', exampleSchema);

module.exports = {
    ExampleModel,
};