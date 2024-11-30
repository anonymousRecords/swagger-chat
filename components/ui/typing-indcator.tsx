export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex w-16 items-center space-x-1 rounded-lg bg-secondary px-3 py-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-200 [animation-delay:-0.3s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-200 [animation-delay:-0.15s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
