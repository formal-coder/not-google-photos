// Photos.js: *Photo can have one Photo_thumbnail - has a one-to-one relationship with Photo_thumbnail
const {Model} = require('objection');

class Photo extends Model {
    static get tableName() {
        return 'Photos';
    }

    static get idColumn() {
        return 'id';
    }
}
module.exports = Photo;
