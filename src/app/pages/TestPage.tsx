export function TestPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Test Page</h1>
        <p className="text-muted-foreground">If you can see this, the route is working!</p>
        <a href="/" className="text-primary hover:underline mt-4 inline-block">
          Return to Home
        </a>
      </div>
    </div>
  );
}
