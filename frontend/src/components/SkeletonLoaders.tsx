export const SkeletonLoader = ({ width = 'w-full', height = 'h-4' }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`}></div>
);

export const SectionSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-4/5"></div>
    </div>
  </div>
);

export const QuoteSkeleton = () => (
  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-6 mb-6 animate-pulse">
    <div className="h-3 w-32 bg-gray-200 rounded mb-3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="mt-4 h-3 bg-gray-200 rounded w-40 mx-auto"></div>
  </div>
);

export const TaskSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-lg p-4 mb-3 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 bg-gray-200 rounded mt-1"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const TaskListSkeleton = ({ count = 3 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <TaskSkeleton key={i} />
    ))}
  </div>
);

export const HabitSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-lg p-4 mb-3 animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
    </div>
    <div className="flex gap-2 mb-3">
      <div className="h-8 bg-gray-200 rounded-full w-12"></div>
      <div className="h-8 bg-gray-200 rounded-full w-12"></div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export const HabitListSkeleton = ({ count = 3 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <HabitSkeleton key={i} />
    ))}
  </div>
);

export const PomodoroSkeleton = () => (
  <div className="bg-white border-2 border-black rounded-lg p-12 animate-pulse">
    <div className="text-center mb-8">
      <div className="h-12 bg-gray-200 rounded w-40 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-4"></div>
      <div className="flex gap-2 justify-center">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);
