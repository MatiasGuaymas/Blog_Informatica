export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex gap-1.5" role="status" aria-label="Cargando">
        <span
          className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"
          style={{ animationDelay: "200ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"
          style={{ animationDelay: "400ms" }}
        />
      </div>
    </div>
  );
}
