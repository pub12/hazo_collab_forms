/**
 * Welcome page
 * Main landing page for the test application
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { get_app_config } from '@/lib/config_client';

export default function WelcomePage() {
  const [app_name, set_app_name] = useState<string | null>(null);
  const [app_version, set_app_version] = useState<string | null>(null);

  useEffect(() => {
    // Fetch config values on client side
    get_app_config().then((config) => {
      set_app_name(config.name);
      set_app_version(config.version);
    });
  }, []);

  return (
    <div className="cls_welcome_container p-8">
      <div className="cls_welcome_content max-w-4xl mx-auto space-y-6">
        <div className="cls_welcome_header">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Hazo Collab Forms
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Test application for the collaboration forms package
          </p>
        </div>

        <Card className="cls_welcome_info_card">
          <CardHeader>
            <CardTitle>About This Application</CardTitle>
            <CardDescription>
              This is a test application built to demonstrate and test the hazo_collab_forms package
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Package Name:</span>
              <Badge variant="secondary">{app_name || 'hazo_collab_forms'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Version:</span>
              <Badge variant="default">{app_version || '1.0.0'}</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="cls_welcome_features grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Package Testing</CardTitle>
              <CardDescription>
                Test all package features and utilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Navigate to the Package Test page to see all package features in action,
                including configuration management, utility functions, and component examples.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modern UI</CardTitle>
              <CardDescription>
                Built with shadcn/ui components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This application uses shadcn/ui for a beautiful and consistent user interface.
                All components are fully customizable and accessible.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="cls_welcome_tech_stack">
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
            <CardDescription>
              Technologies used in this application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Next.js 14</Badge>
              <Badge variant="outline">React</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">TailwindCSS</Badge>
              <Badge variant="outline">shadcn/ui</Badge>
              <Badge variant="outline">ES Modules</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
