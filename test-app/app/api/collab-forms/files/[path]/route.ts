/**
 * API route for serving uploaded files
 * Handles file retrieval for opening files in browser
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string } }
) {
  try {
    const file_path_param = params.path;
    if (!file_path_param) {
      return NextResponse.json({ error: 'File path required' }, { status: 400 });
    }

    // Decode the file path
    const decoded_path = decodeURIComponent(file_path_param);

    // Security: Prevent directory traversal
    if (decoded_path.includes('..') || decoded_path.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    // Construct full file path
    // Files in public directory can be accessed directly
    // For other files, check uploads directory
    let full_path: string;
    if (decoded_path.startsWith('uploads/')) {
      full_path = path.join(process.cwd(), 'public', decoded_path);
    } else {
      // Try public/uploads/collab-forms as fallback
      full_path = path.join(process.cwd(), 'public', 'uploads', 'collab-forms', decoded_path);
    }

    // Check if file exists
    if (!existsSync(full_path)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read and return file
    const file_buffer = await readFile(full_path);
    const file_extension = path.extname(full_path).toLowerCase();

    // Determine content type
    const content_types: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.txt': 'text/plain',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    const content_type = content_types[file_extension] || 'application/octet-stream';

    return new NextResponse(file_buffer, {
      headers: {
        'Content-Type': content_type,
        'Content-Disposition': `inline; filename="${path.basename(full_path)}"`,
      },
    });
  } catch (error) {
    console.error('[files] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'File retrieval failed' },
      { status: 500 }
    );
  }
}

