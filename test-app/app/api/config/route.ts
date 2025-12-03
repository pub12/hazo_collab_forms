/**
 * API route for reading configuration
 * Server-side only endpoint to read config values
 */

import { get_config } from 'hazo_collab_forms/lib';
import { NextResponse } from 'next/server';

/**
 * GET handler for config API
 * Returns configuration values from hazo_collab_forms_config.ini
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const key = searchParams.get('key');

    if (!section || !key) {
      return NextResponse.json(
        { error: 'Section and key parameters are required' },
        { status: 400 }
      );
    }

    const value = get_config(section, key);
    
    return NextResponse.json({
      section,
      key,
      value: value || null,
    });
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json(
      { error: 'Failed to read configuration' },
      { status: 500 }
    );
  }
}

/**
 * GET handler for all config values
 * Returns all configuration values
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section } = body;

    if (!section) {
      return NextResponse.json(
        { error: 'Section parameter is required' },
        { status: 400 }
      );
    }

    // Get all keys in the section
    const app_name = get_config(section, 'name');
    const app_version = get_config(section, 'version');

    return NextResponse.json({
      section,
      values: {
        name: app_name || null,
        version: app_version || null,
      },
    });
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json(
      { error: 'Failed to read configuration' },
      { status: 500 }
    );
  }
}

