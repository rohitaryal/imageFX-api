/**
 * Example: Using Database Integration
 * 
 * This example demonstrates how to use the database integration
 * to track image generation history and user sessions.
 */

import { ImageFX, Prompt } from "@rohitaryal/imagefx-api";
import * as db from "@rohitaryal/imagefx-api/db";

async function main() {
    // Initialize database connection
    console.log("Connecting to database...");
    db.initializeDatabase({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "imagefx_db",
        user: process.env.DB_USER || "imagefx",
        password: process.env.DB_PASSWORD || "imagefx_password",
    });

    // Test database connection
    const isConnected = await db.testConnection();
    if (!isConnected) {
        console.error("Failed to connect to database");
        process.exit(1);
    }
    console.log("✓ Database connected");

    // Initialize ImageFX
    const cookie = process.env.GOOGLE_COOKIE;
    if (!cookie) {
        console.error("GOOGLE_COOKIE environment variable is required");
        process.exit(1);
    }

    const fx = new ImageFX(cookie);

    // Create or update user in database
    console.log("\nCreating/updating user...");
    const user = await db.insertUser(
        "user@example.com",
        "Example User",
        "https://example.com/avatar.png",
        cookie
    );
    console.log(`✓ User created/updated: ${user.name} (ID: ${user.id})`);

    // Create a prompt
    const promptText = "A beautiful sunset over mountains";
    const prompt = new Prompt({
        prompt: promptText,
        seed: 12345,
        numberOfImages: 2,
        aspectRatio: "IMAGE_ASPECT_RATIO_LANDSCAPE",
        generationModel: "IMAGEN_3_5",
    });

    // Generate images
    console.log("\nGenerating images...");
    const images = await fx.generateImage(prompt);
    console.log(`✓ Generated ${images.length} images`);

    // Store prompt in database
    console.log("\nStoring prompt in database...");
    const promptRecord = await db.insertPrompt(
        user.id,
        promptText,
        12345,
        2,
        "IMAGE_ASPECT_RATIO_LANDSCAPE",
        "IMAGEN_3_5",
        images[0].workflowId
    );
    console.log(`✓ Prompt stored (ID: ${promptRecord.id})`);

    // Store generated images in database
    console.log("\nStoring generated images in database...");
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageRecord = await db.insertGeneratedImage(
            user.id,
            promptRecord.id,
            image.mediaID,
            image.encodedImage,
            image.seed,
            image.modelNameType,
            image.aspectRatio,
            image.fingerprintLogRecordId,
            image.workflowId
        );
        console.log(`  ✓ Image ${i + 1} stored (ID: ${imageRecord.id})`);
        
        // Save image to disk
        const savedPath = image.save(".cache/");
        console.log(`    Saved to: ${savedPath}`);
    }

    // Query user's history
    console.log("\n--- User History ---");
    
    // Get recent prompts
    console.log("\nRecent prompts:");
    const userPrompts = await db.getUserPrompts(user.id, 5);
    userPrompts.forEach((p, i) => {
        console.log(`  ${i + 1}. "${p.prompt_text}" - ${p.generation_model} (${p.created_at})`);
    });

    // Get recent generated images
    console.log("\nRecent generated images:");
    const userImages = await db.getUserGeneratedImages(user.id, 5);
    userImages.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.media_generation_id}`);
        console.log(`     Prompt: "${img.prompt_text}"`);
        console.log(`     Model: ${img.model_name_type}`);
        console.log(`     Created: ${img.created_at}`);
    });

    // Example: Generate and store image caption
    if (images.length > 0) {
        console.log("\n--- Image Captioning ---");
        const firstImagePath = ".cache/" + images[0].mediaID + ".png";
        
        console.log("Generating caption for first image...");
        const captions = await fx.generateCaptionsFromImage(
            firstImagePath,
            "PNG",
            2
        );
        
        console.log("Captions generated:");
        captions.forEach((caption, i) => {
            console.log(`  ${i + 1}. ${caption}`);
        });

        // Store captions in database
        console.log("\nStoring captions in database...");
        for (const caption of captions) {
            const captionRecord = await db.insertImageCaption(
                user.id,
                firstImagePath,
                "PNG",
                caption,
                images[0].mediaID
            );
            console.log(`  ✓ Caption stored (ID: ${captionRecord.id})`);
        }
    }

    // Clean up expired sessions (maintenance task)
    console.log("\n--- Maintenance ---");
    const deletedSessions = await db.deleteExpiredSessions();
    console.log(`Deleted ${deletedSessions} expired sessions`);

    // Close database connection
    console.log("\nClosing database connection...");
    await db.closeDatabase();
    console.log("✓ Database connection closed");

    console.log("\n✓ Example completed successfully!");
}

// Run the example
main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
