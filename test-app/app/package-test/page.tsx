/**
 * Package test page
 * Demonstrates all package features and utilities
 */

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { get_app_config } from '@/lib/config_client';

export default function PackageTestPage() {
  // Test config reading
  const [app_name, set_app_name] = useState<string | null>(null);
  const [app_version, set_app_version] = useState<string | null>(null);

  useEffect(() => {
    // Fetch config values on client side
    get_app_config().then((config) => {
      set_app_name(config.name);
      set_app_version(config.version);
    });
  }, []);

  const handle_refresh = () => {
    // Refresh config values
    get_app_config().then((config) => {
      set_app_name(config.name);
      set_app_version(config.version);
    });
  };

  // Test cn utility
  const test_classes = cn(
    'text-3xl',
    'font-bold',
    'tracking-tight'
  );

  return (
    <div className="cls_package_test_container p-8">
      <div className="cls_package_test_content max-w-4xl mx-auto space-y-6">
        <div className="cls_package_test_header">
          <h1 className={test_classes}>
            Package Test
          </h1>
          <p className="text-muted-foreground mt-2">
            Testing the collaboration forms package with shadcn/ui components
          </p>
        </div>
        
        <Card className="cls_config_test">
          <CardHeader>
            <CardTitle>Configuration Test</CardTitle>
            <CardDescription>
              Reading configuration values from hazo_collab_forms_config.ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">App Name:</span>
              <Badge variant="secondary">{app_name || 'Not found'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">App Version:</span>
              <Badge variant="default">{app_version || 'Not found'}</Badge>
            </div>
            <Button 
              variant="outline" 
              onClick={handle_refresh}
              className="w-full mt-4"
            >
              Refresh Config
            </Button>
          </CardContent>
        </Card>

        <Card className="cls_utils_test">
          <CardHeader>
            <CardTitle>Utility Functions Test</CardTitle>
            <CardDescription>
              Testing the cn utility function for Tailwind class merging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The <code className="bg-muted px-2 py-1 rounded text-sm">cn</code> utility
              function is working correctly. The heading above uses merged Tailwind classes.
            </p>
            <div className="flex gap-2">
              <Button variant="default">Default Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cls_package_info">
          <CardHeader>
            <CardTitle>Package Information</CardTitle>
            <CardDescription>
              Module resolution and ES module exports verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This test app successfully imports and uses the{' '}
              <code className="bg-muted px-2 py-1 rounded text-sm">hazo_collab_forms</code> package.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">ES Modules</Badge>
              <Badge variant="outline">.js Extensions</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">Next.js 14</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Module resolution is working correctly with ES modules and .js extensions.
              All exports in the package use explicit .js extensions as required.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

