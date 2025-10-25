import { AppItem } from "./app-list-item";

export function AppList() {
  return (
    <div className="w-full md:px-8 px-4 mx-auto pt-10">
      <div className="flex justify-between items-center py-2 bg-mute sticky top-0 z-10 h-16">
        <div className="text-lg font-bold">应用列表</div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <AppItem key={index} />
        ))}
      </div>
    </div>
  );
}
