# ImageFX API - Product Documentation

## Table of Contents
1. [Overview](#overview)
2. [Product Vision](#product-vision)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Technology Stack](#technology-stack)
6. [Installation & Setup](#installation--setup)
7. [Usage Guide](#usage-guide)
8. [API Reference](#api-reference)
9. [Database Integration](#database-integration)
10. [Development](#development)
11. [Contributing](#contributing)
12. [License](#license)

---

## Overview

**ImageFX API** is an unofficial, free, reverse-engineered API for Google's ImageFX (Imagen) service. It provides programmatic access to Google's state-of-the-art text-to-image and image-to-text generation capabilities, available through [labs.google](https://labs.google).

### Key Highlights
- 🎨 **Text-to-Image Generation**: Create stunning images from textual descriptions using IMAGEN 3/3.1/3.5 models
- 📝 **Image-to-Text Captioning**: Generate detailed captions from images
- 🖥️ **CLI Support**: Full-featured command-line interface for quick access
- 📦 **NPM Module**: Easy integration into Node.js/TypeScript projects
- 🗄️ **Database Integration**: PostgreSQL support for tracking generation history
- 🔒 **Free to Use**: No API keys or subscriptions required (uses Google cookies)

---

## Product Vision

ImageFX API aims to democratize access to advanced AI image generation technology by:
- Providing a simple, developer-friendly interface to Google's ImageFX service
- Enabling developers to build creative applications without infrastructure costs
- Supporting both quick prototyping (CLI) and production integration (module)
- Maintaining user privacy and data control through local database storage

---

## Features

### 1. Text-to-Image Generation

Generate high-quality images from text prompts using Google's Imagen models.

**Capabilities:**
- Multiple model versions (IMAGEN_3, IMAGEN_3_1, IMAGEN_3_5)
- Configurable aspect ratios (square, portrait, landscape)
- Seed control for reproducible results
- Batch generation (multiple images per request)
- Automatic retry mechanism

**Use Cases:**
- Content creation for blogs and websites
- Concept art and design prototyping
- Social media content generation
- Educational and research projects

### 2. Image-to-Text Captioning

Extract detailed textual descriptions from images.

**Capabilities:**
- Support for multiple image formats (JPEG, PNG, WEBP, GIF, etc.)
- Multiple caption variations per image
- High-quality, descriptive output

**Use Cases:**
- Accessibility (alt-text generation)
- Content management and organization
- SEO optimization
- Image search and retrieval

### 3. Command-Line Interface

A powerful CLI for quick image generation and experimentation.

**Features:**
- Simple, intuitive commands
- Environment variable support
- Output directory customization
- Built-in help system
- Cross-platform compatibility (Linux, macOS, Windows)

### 4. NPM Module

TypeScript/JavaScript module for seamless integration.

**Features:**
- Type-safe TypeScript definitions
- Promise-based async API
- Error handling and validation
- Flexible configuration options
- Batch processing support

### 5. Database Integration

PostgreSQL database for tracking and managing generation history.

**Features:**
- User account management
- Session tracking
- Prompt history
- Generated image metadata
- Caption history
- Query helpers and utilities

---

## Architecture

### System Architecture

```
┌─────────────────┐
│   User/Client   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│   ImageFX API   │────▶│  Google ImageFX  │
│   (This Library)│     │   Service        │
└────────┬────────┘     └──────────────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   Database      │
└─────────────────┘
```

### Component Architecture

```
┌──────────────────────────────────────────┐
│           Application Layer              │
│  ┌────────────┐      ┌────────────┐     │
│  │    CLI     │      │   Module   │     │
│  └──────┬─────┘      └──────┬─────┘     │
└─────────┼──────────────────┼────────────┘
          │                  │
          ▼                  ▼
┌──────────────────────────────────────────┐
│           Core Library Layer             │
│  ┌──────────┐  ┌──────────┐            │
│  │ ImageFX  │  │ Account  │            │
│  └─────┬────┘  └─────┬────┘            │
│  ┌─────┴────┐  ┌─────┴────┐            │
│  │  Prompt  │  │  Image   │            │
│  └──────────┘  └──────────┘            │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│        Data Access Layer                 │
│  ┌──────────┐  ┌──────────┐            │
│  │   db.ts  │  │ Types.ts │            │
│  └──────────┘  └──────────┘            │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│         PostgreSQL Database              │
└──────────────────────────────────────────┘
```

### Class Diagram

```
┌─────────────────┐
│    ImageFX      │
├─────────────────┤
│ - account       │
├─────────────────┤
│ + generateImage()│
│ + getImageFromId()│
│ + generateCaptionsFromImage()│
└────────┬────────┘
         │
         │ uses
         ▼
┌─────────────────┐
│    Account      │
├─────────────────┤
│ - cookie        │
│ - token         │
│ - tokenExpiry   │
├─────────────────┤
│ + refreshSession()│
│ + getAuthHeaders()│
└─────────────────┘

┌─────────────────┐
│     Prompt      │
├─────────────────┤
│ - seed          │
│ - prompt        │
│ - numberOfImages│
│ - aspectRatio   │
│ - model         │
├─────────────────┤
│ + toString()    │
└─────────────────┘

┌─────────────────┐
│     Image       │
├─────────────────┤
│ - encodedImage  │
│ - mediaID       │
│ - seed          │
│ - prompt        │
├─────────────────┤
│ + save()        │
│ + toBuffer()    │
└─────────────────┘
```

---

## Technology Stack

### Core Technologies
- **Language**: TypeScript 5.9+
- **Runtime**: Node.js (ES Modules)
- **Database**: PostgreSQL 16+
- **Testing**: Bun Test Framework

### Dependencies

#### Production Dependencies
- `yargs` (^18.0.0) - CLI argument parsing
- `pg` (latest) - PostgreSQL client

#### Development Dependencies
- `@types/bun` (^1.2.21) - Bun type definitions
- `@types/yargs` (^17.0.33) - Yargs type definitions
- `@types/pg` (latest) - PostgreSQL type definitions
- `typescript` (^5.9.2) - TypeScript compiler

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL in Docker container
- **Package Manager**: NPM

---

## Installation & Setup

### Prerequisites
- Node.js 18+ or Bun runtime
- Docker & Docker Compose (for database)
- Google account with ImageFX access

### Step 1: Install the Package

**Global Installation (for CLI):**
```bash
npm install -g @rohitaryal/imagefx-api
```

**Local Installation (for module):**
```bash
npm install @rohitaryal/imagefx-api
```

### Step 2: Obtain Google Cookies

#### Method 1: Using Cookie Editor Extension

1. Install [Cookie Editor](https://github.com/Moustachauve/cookie-editor) browser extension
2. Visit [labs.google/fx/tools/image-fx](https://labs.google/fx/tools/image-fx) and log in
3. Click Cookie Editor icon → Export → Header String
4. Save the cookie string

#### Method 2: Manual Extraction

1. Visit [labs.google/fx/tools/image-fx](https://labs.google/fx/tools/image-fx) and log in
2. Press `Ctrl+Shift+I` (or `Cmd+Option+I` on Mac) to open DevTools
3. Go to Network tab
4. Press `Ctrl+R` to refresh
5. Click on `image-fx` request
6. Find Request Headers → Copy Cookie value

### Step 3: Set Up Environment

Create a `.env` file in your project root:

```bash
# Google Authentication
GOOGLE_COOKIE="your_cookie_here"

# Database Configuration (optional, defaults shown)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=imagefx_db
DB_USER=imagefx
DB_PASSWORD=imagefx_password

# Logging (optional)
LOG_QUERIES=false
```

### Step 4: Start Database (Optional)

If you want to use the database integration:

```bash
docker-compose up -d
```

Verify the database is running:
```bash
docker-compose ps
```

---

## Usage Guide

### Command-Line Interface

#### Basic Image Generation

```bash
# Generate a single image
imagefx generate --prompt "A serene mountain landscape at sunset" --cookie "$GOOGLE_COOKIE"

# Generate multiple images
imagefx generate --prompt "A cute robot" --count 4 --cookie "$GOOGLE_COOKIE"

# Specify model version
imagefx generate --prompt "Abstract art" --model "IMAGEN_3_5" --cookie "$GOOGLE_COOKIE"

# Set aspect ratio
imagefx generate --prompt "Portrait of a cat" --size "PORTRAIT" --cookie "$GOOGLE_COOKIE"

# Save to specific directory
imagefx generate --prompt "Futuristic city" --dir ~/Pictures/ai-art --cookie "$GOOGLE_COOKIE"

# Use seed for reproducibility
imagefx generate --prompt "Random pattern" --seed 12345 --cookie "$GOOGLE_COOKIE"
```

#### Image Captioning

```bash
# Generate caption from image
imagefx caption --image /path/to/image.jpg --type JPEG --cookie "$GOOGLE_COOKIE"

# Generate multiple captions
imagefx caption --image photo.png --type PNG --count 3 --cookie "$GOOGLE_COOKIE"
```

#### Fetch Generated Image

```bash
# Fetch image by media ID
imagefx fetch "media_generation_id_here" --cookie "$GOOGLE_COOKIE"
```

### Module Usage (TypeScript/JavaScript)

#### Basic Image Generation

```typescript
import { ImageFX } from "@rohitaryal/imagefx-api";

// Initialize with cookie
const fx = new ImageFX(process.env.GOOGLE_COOKIE);

// Generate images
const images = await fx.generateImage("A beautiful sunset over the ocean");

// Save images
images.forEach((image, index) => {
    const path = image.save(`./output/sunset_${index}.png`);
    console.log(`Saved: ${path}`);
});
```

#### Advanced Configuration

```typescript
import { ImageFX, Prompt } from "@rohitaryal/imagefx-api";

const fx = new ImageFX(process.env.GOOGLE_COOKIE);

// Create detailed prompt
const prompt = new Prompt({
    prompt: "A cyberpunk cityscape with neon lights",
    seed: 42,
    numberOfImages: 4,
    aspectRatio: "IMAGE_ASPECT_RATIO_LANDSCAPE",
    generationModel: "IMAGEN_3_5"
});

// Generate with retry
const images = await fx.generateImage(prompt, 3); // 3 retries

// Process images
for (const image of images) {
    console.log(`Media ID: ${image.mediaID}`);
    console.log(`Seed: ${image.seed}`);
    console.log(`Model: ${image.modelNameType}`);
    
    // Save image
    image.save("./output/");
}
```

#### Image Captioning

```typescript
import { ImageFX } from "@rohitaryal/imagefx-api";

const fx = new ImageFX(process.env.GOOGLE_COOKIE);

// Generate captions
const captions = await fx.generateCaptionsFromImage(
    "./my-image.jpg",
    "JPEG",
    3 // Generate 3 caption variations
);

console.log("Generated captions:");
captions.forEach((caption, i) => {
    console.log(`${i + 1}. ${caption}`);
});
```

#### Fetch by Media ID

```typescript
import { ImageFX } from "@rohitaryal/imagefx-api";

const fx = new ImageFX(process.env.GOOGLE_COOKIE);

// Fetch previously generated image
const image = await fx.getImageFromId("media_id_here");
image.save("./recovered-image.png");
```

### Database Integration

#### Initialize Database Connection

```typescript
import { initializeDatabase, testConnection } from "@rohitaryal/imagefx-api/db";

// Initialize with default config
initializeDatabase();

// Test connection
const isConnected = await testConnection();
console.log(`Database connected: ${isConnected}`);
```

#### Store Generation History

```typescript
import { ImageFX } from "@rohitaryal/imagefx-api";
import { 
    insertUser, 
    insertPrompt, 
    insertGeneratedImage 
} from "@rohitaryal/imagefx-api/db";

const fx = new ImageFX(process.env.GOOGLE_COOKIE);

// Create or update user
const user = await insertUser(
    "user@example.com",
    "John Doe",
    "https://avatar.url",
    process.env.GOOGLE_COOKIE
);

// Generate image
const prompt = "A beautiful landscape";
const images = await fx.generateImage(prompt);

// Store prompt in database
const promptRecord = await insertPrompt(
    user.id,
    prompt,
    0, // seed
    1, // number of images
    "IMAGE_ASPECT_RATIO_SQUARE",
    "IMAGEN_3"
);

// Store generated images
for (const image of images) {
    await insertGeneratedImage(
        user.id,
        promptRecord.id,
        image.mediaID,
        image.encodedImage,
        image.seed,
        image.modelNameType,
        image.aspectRatio
    );
}
```

#### Query History

```typescript
import { 
    getUserPrompts, 
    getUserGeneratedImages 
} from "@rohitaryal/imagefx-api/db";

// Get user's prompt history
const prompts = await getUserPrompts(userId, 20);
prompts.forEach(p => {
    console.log(`${p.created_at}: ${p.prompt_text}`);
});

// Get user's generated images
const images = await getUserGeneratedImages(userId, 10);
images.forEach(img => {
    console.log(`${img.media_generation_id}: ${img.prompt_text}`);
});
```

---

## API Reference

### Classes

#### ImageFX

Main class for interacting with the ImageFX service.

**Constructor:**
```typescript
constructor(cookie: string)
```

**Methods:**

- `generateImage(prompt: string | Prompt, retries?: number): Promise<Image[]>`
  - Generate images from a text prompt
  - Parameters:
    - `prompt`: Text description or Prompt object
    - `retries`: Number of retry attempts (default: 0)
  - Returns: Array of Image objects

- `getImageFromId(id: string): Promise<Image>`
  - Fetch a previously generated image by its media ID
  - Parameters:
    - `id`: Media generation ID
  - Returns: Image object

- `generateCaptionsFromImage(imagePath: string, imageType: ImageType, count?: number): Promise<string[]>`
  - Generate captions from an image
  - Parameters:
    - `imagePath`: Path to image file
    - `imageType`: Image format (JPEG, PNG, etc.)
    - `count`: Number of captions to generate (default: 1)
  - Returns: Array of caption strings

#### Prompt

Configuration object for image generation.

**Constructor:**
```typescript
constructor(args: PromptArg)
```

**Properties:**
- `prompt: string` - Text description
- `seed?: number` - Random seed (default: 0)
- `numberOfImages?: number` - Number of images (default: 1)
- `aspectRatio?: AspectRatio` - Image aspect ratio
- `generationModel?: Model` - Model version

#### Image

Represents a generated image.

**Properties:**
- `encodedImage: string` - Base64 encoded image
- `mediaID: string` - Unique media generation ID
- `seed: number` - Seed used for generation
- `prompt: string` - Prompt used
- `aspectRatio: AspectRatio` - Image aspect ratio
- `modelNameType: Model` - Model used

**Methods:**
- `save(directory?: string): string` - Save image to disk
- `toBuffer(): Buffer` - Get image as Buffer

#### Account

Manages user authentication and sessions.

**Constructor:**
```typescript
constructor(cookie: string)
```

**Methods:**
- `refreshSession(): Promise<void>` - Refresh authentication token
- `getAuthHeaders(): Headers` - Get headers for authenticated requests
- `isTokenExpired(): boolean` - Check if token is expired

### Database Functions

See [Database Schema Documentation](./schema.md) for detailed database API reference.

### Constants

**AspectRatio:**
- `IMAGE_ASPECT_RATIO_SQUARE`
- `IMAGE_ASPECT_RATIO_PORTRAIT`
- `IMAGE_ASPECT_RATIO_LANDSCAPE`
- `IMAGE_ASPECT_RATIO_UNSPECIFIED`

**Model:**
- `IMAGEN_3`
- `IMAGEN_3_1`
- `IMAGEN_3_5` (likely IMAGEN 4)

**ImageType:**
- `JPEG`, `JPG`, `PNG`, `WEBP`, `GIF`, `BMP`, `TIFF`, etc.

---

## Development

### Project Structure

```
imagefx-api/
├── src/
│   ├── Account.ts          # User account management
│   ├── ImageFX.ts          # Main API class
│   ├── Image.ts            # Image representation
│   ├── Prompt.ts           # Prompt configuration
│   ├── Types.ts            # TypeScript type definitions
│   ├── Constants.ts        # Constants and enums
│   ├── db.ts               # Database utilities
│   ├── cli.ts              # CLI implementation
│   ├── index.ts            # Module exports
│   └── schema.sql          # Database schema
├── docs/
│   ├── schema.md           # Database schema documentation
│   └── product.md          # Product documentation (this file)
├── tests/
│   ├── 1-account.test.ts
│   ├── 2-generate.test.ts
│   ├── 3-image.test.ts
│   └── 4-captions.test.ts
├── examples/
│   ├── 1-generate-and-save.ts
│   ├── 2-detailed-prompt.ts
│   ├── 3-account-operations.ts
│   ├── 4-fetch-from-id.ts
│   └── 5-generate-caption.ts
├── docker-compose.yml      # Docker services
├── package.json
├── tsconfig.json
└── README.md
```

### Building from Source

```bash
# Clone repository
git clone https://github.com/rohitaryal/imageFX-api.git
cd imageFX-api

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

### Running Tests

```bash
# Set up environment
export GOOGLE_COOKIE="your_cookie_here"

# Run all tests
npm test

# Run with Bun
bun test
```

### Development Workflow

1. Make changes to source files in `src/`
2. Build: `npm run build`
3. Test: `npm test`
4. Test CLI locally: `node dist/cli.js generate --prompt "test"`

---

## Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes**
4. **Follow coding standards**: Use existing code style
5. **Add tests**: Ensure all tests pass
6. **Commit your changes**: Use clear commit messages
7. **Push to your fork**: `git push origin feature/your-feature`
8. **Open a Pull Request**

### Coding Standards

- Use TypeScript for all code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Include error handling
- Write tests for new features

### Testing Requirements

- All tests must pass: `npm test`
- Code must build without errors: `npm run build`
- Follow existing test patterns

### Reporting Issues

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- **DO NOT include cookies or tokens**

---

## Troubleshooting

### Common Issues

#### 1. Authentication Errors

**Problem**: "Authentication failed" or "Cookie expired"

**Solution:**
- Re-extract cookies from browser
- Ensure you're logged into labs.google
- Check that cookies include all required fields

#### 2. ImageFX Not Available in Your Country

**Problem**: Can't access labs.google/fx/tools/image-fx

**Solution:**
1. Use a VPN (Windscribe, Proton, etc.)
2. Access labs.google and log in
3. Extract cookies (you won't need VPN after this)

#### 3. Database Connection Errors

**Problem**: "Connection refused" or "Database not reachable"

**Solution:**
- Ensure Docker containers are running: `docker-compose ps`
- Check database credentials in `.env`
- Verify port 5432 is not in use: `lsof -i :5432`

#### 4. Image Generation Fails

**Problem**: "Server responded with empty images"

**Solution:**
- Check if your Google account has access to ImageFX
- Verify prompt isn't empty or invalid
- Try using retry parameter: `generateImage(prompt, 3)`
- Check rate limits (try again after a few minutes)

---

## Roadmap

### Planned Features
- [ ] Rate limiting and quota management
- [ ] Image editing capabilities
- [ ] Style transfer
- [ ] Batch processing optimization
- [ ] Web UI dashboard
- [ ] REST API server
- [ ] Cloud deployment guides
- [ ] Advanced prompt templates
- [ ] Image variation generation

### Under Consideration
- Support for other image generation services
- Plugin system for custom workflows
- Integration with popular CMS platforms
- Mobile SDK

---

## License

This project is licensed under the terms specified in the LICENSE file.

---

## Disclaimer

**Important**: This project is an unofficial reverse-engineered API for educational purposes. It demonstrates usage of Google's private ImageFX API but is **not affiliated with or endorsed by Google**. 

### Terms of Use
- Use at your own risk
- Respect Google's Terms of Service
- Not intended for commercial use without proper authorization
- May break if Google updates their API
- No warranty or guarantee of functionality

### Privacy & Security
- Cookies are sensitive credentials - keep them secure
- Never share logs containing cookies or tokens
- Use environment variables for secrets
- Consider encrypting stored cookies in database
- Regularly rotate cookies for security

### Responsible Use
- Don't abuse the service
- Respect rate limits
- Use for legitimate purposes only
- Don't generate harmful or illegal content
- Follow community guidelines

---

## Support & Community

### Getting Help
- 📚 [Documentation](https://github.com/rohitaryal/imageFX-api/tree/main/docs)
- 🐛 [Issue Tracker](https://github.com/rohitaryal/imageFX-api/issues)
- 💬 [Discussions](https://github.com/rohitaryal/imageFX-api/discussions)
- 📧 Contact the maintainer through GitHub

### Useful Links
- [GitHub Repository](https://github.com/rohitaryal/imageFX-api)
- [NPM Package](https://www.npmjs.com/package/@rohitaryal/imagefx-api)
- [Google ImageFX](https://labs.google/fx/tools/image-fx)
- [Examples Directory](https://github.com/rohitaryal/imageFX-api/tree/main/examples)

---

## Acknowledgments

- Google for creating ImageFX/Imagen
- The open-source community
- All contributors to this project

---

**Last Updated**: November 2025  
**Version**: 2.1.1  
**Maintainer**: [@rohitaryal](https://github.com/rohitaryal)
