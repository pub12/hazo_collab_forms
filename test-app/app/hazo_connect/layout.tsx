/**
 * Layout for hazo_connect routes
 * This layout excludes the sidebar and provides a standalone experience
 */

export default function HazoConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}





