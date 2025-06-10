/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    // Create the photos table with comments
    return knex.schema.createTable('photos', (table) => {
        table.increments('id').primary(); // Primary key
        table.string('url').notNullable(); // URL of the photo
        table.string('size').notNullable(); // Size of the photo
        table.string('type').notNullable(); // Type of the photo (e.g., image/jpeg)
        table.string('description').notNullable(); // Description of the photo
        table.timestamp('updated_at').defaultTo(knex.fn.now()); // Update timestamp
        table.string('thumbnail_url').notNullable(); // URL of the thumbnail

        // Add comments to the columns
        table.comment('Table for storing photos with their URLs, size, type, thumbnail_url, descriptions, and timestamps.');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    // Delete the photos table
    return knex.schema.dropTable('photos');
};
