/**
 * API route for listing SQLite tables
 * Used by the SQLite admin UI
 */

import { NextResponse } from "next/server"
import { getSqliteAdminService } from "hazo_connect/server"
import { getHazoConnectSingleton } from "hazo_connect/nextjs/setup"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Initialize adapter with admin UI enabled
    getHazoConnectSingleton({
      enableAdminUi: true,
      sqlitePath: process.env.HAZO_CONNECT_SQLITE_PATH || 
        '/Users/pubuduabayasiri/LocalDocuments/02.Nextjs/99.lib/hazo_collab_forms/test-app/data/hazo_auth.sqlite'
    });
    
    const service = getSqliteAdminService()
    const tables = await service.listTables()
    return NextResponse.json({ data: tables })
  } catch (error) {
    return toErrorResponse(error, "Failed to list SQLite tables")
  }
}

function toErrorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback
  const status = message.toLowerCase().includes("required") ? 400 : 500
  return NextResponse.json({ error: message }, { status })
}

