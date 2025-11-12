# Database Schema Documentation

This document describes the database schema for the ImageFX API project. The database uses PostgreSQL to store user accounts, sessions, prompts, generated images, and image captions.

## Overview

The ImageFX API database consists of five main tables:
- **users**: User account information
- **sessions**: User authentication sessions
- **prompts**: Prompt history for image generation
- **generated_images**: Metadata about generated images
- **image_captions**: Generated captions from images

## Entity Relationship Diagram

```
┌─────────────┐
│   users     │
└──────┬──────┘
       │
       │ 1:N
       ├─────────┬─────────────┬──────────────┐
       │         │             │              │
       ▼         ▼             ▼              ▼
┌─────────┐ ┌─────────┐ ┌──────────────┐ ┌──────────────┐
│sessions │ │ prompts │ │generated_    │ │image_        │
│         │ │         │ │images        │ │captions      │
└─────────┘ └────┬────┘ └──────────────┘ └──────────────┘
                 │
                 │ 1:N
                 ▼
            ┌──────────────┐
            │generated_    │
            │images        │
            └──────────────┘
```

## Table Definitions

### 1. users

Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE NOT NULL | User's email address |
| name | VARCHAR(255) | NOT NULL | User's display name |
| image_url | TEXT | | URL to user's profile image |
| google_cookie | TEXT | | Encrypted Google authentication cookie |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_users_email` on `email`

**Triggers:**
- `update_users_updated_at`: Automatically updates `updated_at` on row update

### 2. sessions

Stores user session data for authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique session identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users(id) | Reference to user |
| access_token | TEXT | NOT NULL | JWT or access token |
| expires_at | TIMESTAMP WITH TIME ZONE | NOT NULL | Token expiration time |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Session creation timestamp |

**Indexes:**
- `idx_sessions_user_id` on `user_id`
- `idx_sessions_expires_at` on `expires_at`

**Constraints:**
- `unique_active_session`: Ensures unique combination of `user_id` and `access_token`
- Foreign key cascade delete: Sessions are deleted when user is deleted

### 3. prompts

Stores the history of prompts used for image generation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique prompt identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users(id) | Reference to user |
| prompt_text | TEXT | NOT NULL | The actual prompt text |
| seed | INTEGER | DEFAULT 0 | Random seed for generation |
| number_of_images | INTEGER | DEFAULT 1 | Number of images to generate |
| aspect_ratio | VARCHAR(50) | DEFAULT 'IMAGE_ASPECT_RATIO_SQUARE' | Aspect ratio of images |
| generation_model | VARCHAR(50) | DEFAULT 'IMAGEN_3' | Model used for generation |
| workflow_id | VARCHAR(255) | | Workflow identifier |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Prompt creation timestamp |

**Indexes:**
- `idx_prompts_user_id` on `user_id`
- `idx_prompts_created_at` on `created_at`

**Constraints:**
- Foreign key cascade delete: Prompts are deleted when user is deleted

**Valid Values:**
- `aspect_ratio`: `IMAGE_ASPECT_RATIO_SQUARE`, `IMAGE_ASPECT_RATIO_PORTRAIT`, `IMAGE_ASPECT_RATIO_LANDSCAPE`, `IMAGE_ASPECT_RATIO_UNSPECIFIED`
- `generation_model`: `IMAGEN_3`, `IMAGEN_3_1`, `IMAGEN_3_5`

### 4. generated_images

Stores metadata about generated images.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique image identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users(id) | Reference to user |
| prompt_id | INTEGER | FOREIGN KEY → prompts(id) | Reference to prompt used |
| media_generation_id | VARCHAR(255) | UNIQUE NOT NULL | Google's media generation ID |
| encoded_image | TEXT | NOT NULL | Base64 encoded image data |
| seed | INTEGER | | Seed value used |
| model_name_type | VARCHAR(50) | | Model used for generation |
| aspect_ratio | VARCHAR(50) | | Aspect ratio of the image |
| fingerprint_log_record_id | VARCHAR(255) | | Fingerprint log record ID |
| workflow_id | VARCHAR(255) | | Workflow identifier |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Image generation timestamp |

**Indexes:**
- `idx_generated_images_user_id` on `user_id`
- `idx_generated_images_prompt_id` on `prompt_id`
- `idx_generated_images_media_generation_id` on `media_generation_id`

**Constraints:**
- Foreign key cascade delete: Images are deleted when user is deleted
- Foreign key set null: `prompt_id` is set to NULL when prompt is deleted

### 5. image_captions

Stores generated captions from images using the captioning feature.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique caption identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users(id) | Reference to user |
| image_path | TEXT | NOT NULL | Path to the source image |
| image_type | VARCHAR(20) | NOT NULL | Image type (PNG, JPEG, WEBP, etc.) |
| caption_text | TEXT | NOT NULL | Generated caption text |
| media_generation_id | VARCHAR(255) | | Associated media generation ID |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | Caption generation timestamp |

**Indexes:**
- `idx_image_captions_user_id` on `user_id`

**Constraints:**
- Foreign key cascade delete: Captions are deleted when user is deleted

**Valid Image Types:**
- `jpeg`, `jpg`, `jpe`, `png`, `gif`, `webp`, `svg`, `bmp`, `tiff`, `apng`, `avif`

## Database Functions

### update_updated_at_column()

A trigger function that automatically updates the `updated_at` column to the current timestamp whenever a row is updated.

**Usage:**
```sql
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Connection Configuration

The database can be configured using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| DB_HOST | localhost | Database host |
| DB_PORT | 5432 | Database port |
| DB_NAME | imagefx_db | Database name |
| DB_USER | imagefx | Database user |
| DB_PASSWORD | imagefx_password | Database password |

## Setup Instructions

### Using Docker Compose

1. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

2. The database will automatically initialize with the schema from `src/schema.sql`

3. Verify the connection:
   ```bash
   docker-compose exec postgres psql -U imagefx -d imagefx_db -c "\dt"
   ```

### Manual Setup

1. Create the database:
   ```bash
   createdb imagefx_db
   ```

2. Run the schema file:
   ```bash
   psql -U imagefx -d imagefx_db -f src/schema.sql
   ```

## Query Examples

### Get user's recent generated images with prompts
```sql
SELECT 
    gi.media_generation_id,
    p.prompt_text,
    gi.model_name_type,
    gi.aspect_ratio,
    gi.created_at
FROM generated_images gi
LEFT JOIN prompts p ON gi.prompt_id = p.id
WHERE gi.user_id = $1
ORDER BY gi.created_at DESC
LIMIT 10;
```

### Get user's prompt history
```sql
SELECT 
    prompt_text,
    generation_model,
    aspect_ratio,
    number_of_images,
    created_at
FROM prompts
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 20;
```

### Clean up expired sessions
```sql
DELETE FROM sessions 
WHERE expires_at < NOW();
```

## Maintenance

### Regular Cleanup Tasks

1. **Delete expired sessions** (recommended: daily)
   ```sql
   DELETE FROM sessions WHERE expires_at < NOW();
   ```

2. **Archive old generated images** (recommended: monthly)
   ```sql
   -- Move images older than 90 days to archive table
   INSERT INTO generated_images_archive 
   SELECT * FROM generated_images 
   WHERE created_at < NOW() - INTERVAL '90 days';
   
   DELETE FROM generated_images 
   WHERE created_at < NOW() - INTERVAL '90 days';
   ```

### Backup Strategy

1. **Full backup** (recommended: daily)
   ```bash
   pg_dump -U imagefx imagefx_db > backup_$(date +%Y%m%d).sql
   ```

2. **Backup with compression**
   ```bash
   pg_dump -U imagefx imagefx_db | gzip > backup_$(date +%Y%m%d).sql.gz
   ```

## Performance Considerations

1. **Indexes**: All foreign keys and frequently queried columns are indexed
2. **Partitioning**: Consider partitioning `generated_images` table by date for large datasets
3. **Connection Pooling**: The application uses connection pooling (max 20 connections)
4. **Query Logging**: Enable with `LOG_QUERIES=true` environment variable for debugging

## Security Considerations

1. **Sensitive Data**: 
   - `google_cookie` should be encrypted at rest
   - `access_token` should be hashed or encrypted
   
2. **SQL Injection**: All queries use parameterized statements

3. **Access Control**: Use role-based access control in PostgreSQL

4. **Audit Trail**: Consider adding audit tables for sensitive operations
