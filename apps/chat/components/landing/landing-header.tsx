import { cn } from "@/lib";

export function LandingHeader() {
  return (
    <header className={cn('text-center space-y-6 mb-8')}>
      <h1
        className={cn(
          'text-2xl md:text-4xl font-bold',
          'bg-gradient-to-r from-gray-800 to-gray-600',
          'bg-clip-text text-transparent',
          'leading-tight'
        )}
      >
        Don't Read
        <br />
        Swagger anymore
      </h1>
      <p className={cn('text-lg text-gray-600 max-w-md mx-auto')}>
        Explore Swagger docs through conversation.
      </p>
    </header>
  );
}
