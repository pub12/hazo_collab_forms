/**
 * API route to fetch user profiles by IDs
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createCrudService } from 'hazo_connect/server';
import { getHazoConnectSingleton } from 'hazo_connect/nextjs/setup';

/**
 * POST handler for fetching user profiles
 * Accepts an array of user IDs and returns their profiles
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_ids } = body;

    if (!Array.isArray(user_ids) || user_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'user_ids array is required' },
        { status: 400 }
      );
    }

    const hazoConnect = getHazoConnectSingleton();
    const usersService = createCrudService(hazoConnect, 'hazo_users');

    const users = await usersService.list((query) =>
      query.whereIn('id', user_ids)
    );

    const profiles = users.map((user) => ({
      id: user.id as string,
      name: (user.name as string) || (user.email_address as string)?.split('@')[0] || 'User',
      email: user.email_address as string,
      avatar_url: user.profile_picture_url as string | undefined,
    }));

    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error('[hazo_auth/profiles] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}




