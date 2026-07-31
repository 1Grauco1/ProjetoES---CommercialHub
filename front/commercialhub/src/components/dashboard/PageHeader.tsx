import Link from "next/link";
import { Plus } from "lucide-react";

export default function PageHeader({
  title,
  description,
  action = false,
}: {
  title: string;
  description: string;
  action?: boolean;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-slate-500">{description}</p>
      </div>
      {action && (
        <Link
          href="/cadastrar-imovel"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D35400] px-5 py-3 font-semibold text-white shadow-lg shadow-orange-950/15 transition hover:bg-[#AC4501]"
        >
          <Plus size={19} />
          Anunciar sala
        </Link>
      )}
    </div>
  );
}
