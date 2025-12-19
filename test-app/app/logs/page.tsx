'use client';

/**
 * Log viewer page for hazo_logs
 * Displays logs from hazo_collab_forms and other packages
 */

import { LogViewerPage } from 'hazo_logs/ui';

export default function LogsPage() {
  return (
    <div className="h-screen">
      <LogViewerPage
        apiBasePath="/api/logs"
        title="System Logs"
        showHeader={true}
      />
    </div>
  );
}
