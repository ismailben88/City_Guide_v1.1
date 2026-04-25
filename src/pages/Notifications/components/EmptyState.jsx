export default function EmptyState({ filtered }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-3xl">
        {filtered ? "🔍" : "🎉"}
      </div>
      <p className="text-sm font-medium text-gray-700">
        {filtered ? "Aucun résultat" : "Tout est lu !"}
      </p>
      <p className="mt-1 text-xs text-gray-400">
        {filtered
          ? "Essayez un autre filtre ou mot-clé."
          : "Vous êtes à jour sur toutes vos notifications."}
      </p>
    </div>
  );
}
