/**
 * API route for getting SQLite table schema
 * Used by the SQLite admin UI
 */

import { NextRequest, NextResponse } from "next/server"
import { getSqliteAdminService } from "hazo_connect/server"
import { getHazoConnectSingleton } from "hazo_connect/nextjs/setup"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  // Initialize adapter with admin UI enabled
  getHazoConnectSingleton({
    enableAdminUi: true,
    sqlitePath: process.env.HAZO_CONNECT_SQLITE_PATH || 
      '/Users/pubuduabayasiri/LocalDocuments/02.Nextjs/99.lib/hazo_collab_forms/test-app/data/hazo_auth.sqlite'
  });
  
  const service = getSqliteAdminService()
  const url = new URL(request.url)
  const table = url.searchParams.get("table")

  if (!table) {
    return NextResponse.json(
      { error: "Query parameter 'table' is required." },
      { status: 400 }
    )
  }

  try {
    const schema = await service.getTableSchema(table)
    return NextResponse.json({ data: schema })
  } catch (error) {
    return toErrorResponse(error, `Failed to load schema for table '${table}'`)
  }
}

function toErrorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback
  const status = message.toLowerCase().includes("required") ? 400 : 500
  return NextResponse.json({ error: message }, { status })
}

