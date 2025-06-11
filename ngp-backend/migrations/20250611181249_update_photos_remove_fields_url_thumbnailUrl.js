/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.table('photos', function(table) {
        table.dropColumn('url');
        table.dropColumn('thumbnail_url');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.table('photos', function(table) {
        table.string('url').notNullable();
        table.string('thumbnail_url').notNullable();
    });
};
