Photo storage: Save uploaded photos as files on the server (e.g., in an uploads/ folder).

Avoid duplicates: Keep track of uploaded filenames to prevent duplicates.

Metadata: Store photo info (filename, size, upload date) in a JSON file or in-memory object for quick access.

Thumbnails: Generate thumbnails asynchronously after upload; serve thumbnails for previews, originals on click.

Fragmentation: Consider splitting photos by upload date or size thresholds for low-latency access.

Compression: Optionally compress photos losslessly before saving to reduce storage.

Authentication: Minimal or none since it's a personal project.

API routes:

    Upload photos (save file + update metadata),

    List photos (read metadata),

    Delete photos (remove file + update metadata).

    Thumbnail generation (asynchronous job).

TODO => Moving to a database (MySQL + Sequelize) improves metadata management, search, and scalability.
