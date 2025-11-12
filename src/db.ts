import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

/**
 * Database connection configuration
 */
interface DbConfig {
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    max?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
}

/**
 * Default database configuration
 * Can be overridden using environment variables
 */
const defaultConfig: DbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'imagefx_db',
    user: process.env.DB_USER || 'imagefx',
    password: process.env.DB_PASSWORD || 'imagefx_password',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
};

/**
 * Database connection pool
 */
let pool: Pool | null = null;

/**
 * Initialize the database connection pool
 * 
 * @param config Optional database configuration
 * @returns Initialized connection pool
 */
export function initializeDatabase(config?: DbConfig): Pool {
    if (pool) {
        return pool;
    }

    const finalConfig = { ...defaultConfig, ...config };
    pool = new Pool(finalConfig);

    // Handle pool errors
    pool.on('error', (err) => {
        console.error('Unexpected error on idle database client', err);
    });

    return pool;
}

/**
 * Get the database connection pool
 * Initializes the pool if it hasn't been created yet
 * 
 * @returns Database connection pool
 */
export function getPool(): Pool {
    if (!pool) {
        pool = initializeDatabase();
    }
    return pool;
}

/**
 * Execute a SQL query with parameters
 * 
 * @param text SQL query string
 * @param params Query parameters
 * @returns Query result
 */
export async function query<T extends QueryResultRow = any>(
    text: string,
    params?: any[]
): Promise<QueryResult<T>> {
    const start = Date.now();
    const client = getPool();

    try {
        const result = await client.query<T>(text, params);
        const duration = Date.now() - start;
        
        if (process.env.LOG_QUERIES === 'true') {
            console.log('Executed query', { text, duration, rows: result.rowCount });
        }

        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * Execute a transaction with multiple queries
 * 
 * @param callback Function containing transaction logic
 * @returns Result from the callback function
 */
export async function transaction<T>(
    callback: (client: PoolClient) => Promise<T>
): Promise<T> {
    const client = await getPool().connect();

    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction error:', error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Close the database connection pool
 */
export async function closeDatabase(): Promise<void> {
    if (pool) {
        await pool.end();
        pool = null;
    }
}

/**
 * Test database connection
 * 
 * @returns true if connection is successful, false otherwise
 */
export async function testConnection(): Promise<boolean> {
    try {
        const result = await query('SELECT NOW()');
        return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
}

// Database query helper functions

/**
 * Insert a new user
 */
export async function insertUser(email: string, name: string, imageUrl?: string, googleCookie?: string) {
    const text = `
        INSERT INTO users (email, name, image_url, google_cookie)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO UPDATE
        SET name = EXCLUDED.name,
            image_url = EXCLUDED.image_url,
            google_cookie = EXCLUDED.google_cookie,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
    `;
    const values = [email, name, imageUrl, googleCookie];
    const result = await query(text, values);
    return result.rows[0];
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
    const text = 'SELECT * FROM users WHERE email = $1';
    const result = await query(text, [email]);
    return result.rows[0];
}

/**
 * Insert a new session
 */
export async function insertSession(userId: number, accessToken: string, expiresAt: Date) {
    const text = `
        INSERT INTO sessions (user_id, access_token, expires_at)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const values = [userId, accessToken, expiresAt];
    const result = await query(text, values);
    return result.rows[0];
}

/**
 * Insert a new prompt
 */
export async function insertPrompt(
    userId: number,
    promptText: string,
    seed?: number,
    numberOfImages?: number,
    aspectRatio?: string,
    generationModel?: string,
    workflowId?: string
) {
    const text = `
        INSERT INTO prompts (user_id, prompt_text, seed, number_of_images, aspect_ratio, generation_model, workflow_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const values = [userId, promptText, seed, numberOfImages, aspectRatio, generationModel, workflowId];
    const result = await query(text, values);
    return result.rows[0];
}

/**
 * Insert a generated image
 */
export async function insertGeneratedImage(
    userId: number,
    promptId: number | null,
    mediaGenerationId: string,
    encodedImage: string,
    seed?: number,
    modelNameType?: string,
    aspectRatio?: string,
    fingerprintLogRecordId?: string,
    workflowId?: string
) {
    const text = `
        INSERT INTO generated_images (
            user_id, prompt_id, media_generation_id, encoded_image, seed,
            model_name_type, aspect_ratio, fingerprint_log_record_id, workflow_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;
    const values = [
        userId, promptId, mediaGenerationId, encodedImage, seed,
        modelNameType, aspectRatio, fingerprintLogRecordId, workflowId
    ];
    const result = await query(text, values);
    return result.rows[0];
}

/**
 * Insert an image caption
 */
export async function insertImageCaption(
    userId: number,
    imagePath: string,
    imageType: string,
    captionText: string,
    mediaGenerationId?: string
) {
    const text = `
        INSERT INTO image_captions (user_id, image_path, image_type, caption_text, media_generation_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const values = [userId, imagePath, imageType, captionText, mediaGenerationId];
    const result = await query(text, values);
    return result.rows[0];
}

/**
 * Get user's prompt history
 */
export async function getUserPrompts(userId: number, limit = 50) {
    const text = `
        SELECT * FROM prompts
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2
    `;
    const result = await query(text, [userId, limit]);
    return result.rows;
}

/**
 * Get user's generated images
 */
export async function getUserGeneratedImages(userId: number, limit = 50) {
    const text = `
        SELECT gi.*, p.prompt_text
        FROM generated_images gi
        LEFT JOIN prompts p ON gi.prompt_id = p.id
        WHERE gi.user_id = $1
        ORDER BY gi.created_at DESC
        LIMIT $2
    `;
    const result = await query(text, [userId, limit]);
    return result.rows;
}

/**
 * Delete expired sessions
 */
export async function deleteExpiredSessions() {
    const text = 'DELETE FROM sessions WHERE expires_at < NOW()';
    const result = await query(text);
    return result.rowCount;
}
