/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.table('photos', function(table) {
        table.string('filename').notNullable().defaultTo('').comment('safe filename for the photo');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.table('photos', function(table) {
        table.dropColumn('filename');
    })
};
