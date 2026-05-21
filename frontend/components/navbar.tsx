type NavbarProps = {
  username: string;
};

export const Navbar = ({ username }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5/6 items-center justify-between px-4 sm:px-4 lg:px-6">
        <div className="text-lg font-semibold tracking-[0.2em] text-slate-900">
          TASKFLOW
        </div>
        <div className="text-sm font-medium text-slate-600">{username}</div>
      </div>
    </header>
  );
};
