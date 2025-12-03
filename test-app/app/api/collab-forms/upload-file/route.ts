/**
 * API route for uploading files in collaboration forms
 * Handles file upload, validation, and storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const form_data = await request.formData();
    const file = form_data.get('file') as File;
    const files_dir = form_data.get('files_dir') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (default 10MB if not specified)
    const max_size = 10 * 1024 * 1024; // 10MB
    if (file.size > max_size) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${max_size} bytes` },
        { status: 400 }
      );
    }

    // Determine upload directory
    let upload_dir: string;
    if (files_dir) {
      // If files_dir is provided, use it (can be relative or absolute)
      upload_dir = files_dir.startsWith('/')
        ? files_dir
        : path.join(process.cwd(), files_dir);
    } else {
      // Default to uploads directory in public
      upload_dir = path.join(process.cwd(), 'public', 'uploads', 'collab-forms');
    }

    // Ensure directory exists
    if (!existsSync(upload_dir)) {
      await mkdir(upload_dir, { recursive: true });
    }

    // Generate unique filename
    const file_extension = path.extname(file.name);
    const file_base_name = path.basename(file.name, file_extension);
    const unique_filename = `${file_base_name}-${Date.now()}${file_extension}`;
    const file_path = path.join(upload_dir, unique_filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(file_path, buffer);

    // Return file metadata
    // For public files, return path relative to public directory
    // For other files, return full path
    const is_public = upload_dir.includes('public');
    const relative_path = is_public
      ? path.relative(path.join(process.cwd(), 'public'), file_path)
      : file_path;

    return NextResponse.json({
      file_path: is_public ? `/${relative_path.replace(/\\/g, '/')}` : relative_path,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
    });
  } catch (error) {
    console.error('[upload-file] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'File upload failed' },
      { status: 500 }
    );
  }
}

