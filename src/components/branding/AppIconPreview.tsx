export function AppIconPreview() {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-20 w-20 place-items-center rounded-[26px] bg-emerald-600 shadow-xl shadow-emerald-600/30">
        <div className="text-4xl font-black text-white">M</div>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">Installable PWA icon direction</p>
        <p className="mt-1 text-sm text-slate-500">
          Rounded square, green field, white vault-inspired M mark.
        </p>
      </div>
    </div>
  );
}
