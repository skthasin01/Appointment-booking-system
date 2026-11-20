/**
 * Contextual loading placeholders built on daisyUI's `skeleton` component.
 * Each shape mirrors the real layout so a slow response does not shift content.
 */

export const Frame = ({ label = 'Loading…', className = '', children }) => (
  <div role="status" aria-label={label} aria-busy="true" className={className}>
    {children}
  </div>
);

export const Bar = ({ className = '' }) => (
  <span className={`skeleton block ${className}`} aria-hidden="true" />
);

export const TextLines = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }).map((_, index) => (
      <Bar
        key={index}
        className={`skeleton-text h-3 ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
      />
    ))}
  </div>
);

export const StatGridSkeleton = ({ count = 4 }) => (
  <Frame
    label="Loading statistics"
    className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
  >
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="card border border-base-300 bg-base-100 p-5 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <Bar className="h-3 w-24" />
            <Bar className="h-8 w-16" />
            <Bar className="h-3 w-28" />
          </div>
          <Bar className="h-12 w-12 rounded-xl" />
        </div>
      </div>
    ))}
  </Frame>
);

export const TableSkeleton = ({ rows = 5, columns = 5, label = 'Loading table' }) => (
  <Frame
    label={label}
    className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm"
  >
    <div className="flex items-center justify-between gap-4 border-b border-base-300 p-5">
      <div className="space-y-2">
        <Bar className="h-4 w-36" />
        <Bar className="h-3 w-52" />
      </div>
      <Bar className="h-8 w-20 rounded-lg" />
    </div>
    <div className="space-y-4 p-5">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Bar key={index} className="h-3 w-20" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 border-t border-base-300 pt-4 first:border-0 first:pt-0"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((__, colIndex) => (
            <Bar
              key={colIndex}
              className={`h-9 ${colIndex === 0 ? 'rounded-full' : 'rounded-lg'}`}
            />
          ))}
        </div>
      ))}
    </div>
  </Frame>
);

export const DoctorCardSkeleton = () => (
  <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
    <div className="flex items-start gap-4">
      <Bar className="h-14 w-14 flex-none rounded-full" />
      <div className="min-w-0 flex-1 space-y-3">
        <Bar className="h-4 w-32" />
        <div className="flex gap-2">
          <Bar className="h-5 w-20 rounded-full" />
          <Bar className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
    <div className="mt-5 flex gap-4">
      <Bar className="h-3 w-28" />
      <Bar className="h-3 w-20" />
    </div>
    <div className="mt-5 flex items-center justify-between border-t border-base-300 pt-4">
      <Bar className="h-4 w-24" />
      <Bar className="h-8 w-24 rounded-lg" />
    </div>
  </div>
);

export const DoctorGridSkeleton = ({ count = 6 }) => (
  <Frame
    label="Loading doctors"
    className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
  >
    {Array.from({ length: count }).map((_, index) => (
      <DoctorCardSkeleton key={index} />
    ))}
  </Frame>
);

export const ProfileSkeleton = () => (
  <Frame
    label="Loading profile"
    className="mx-auto max-w-5xl space-y-5 px-4 py-8 lg:px-6"
  >
    <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-5">
        <Bar className="h-24 w-24 flex-none rounded-full" />
        <div className="min-w-0 flex-1 space-y-3">
          <Bar className="h-5 w-48" />
          <Bar className="h-3 w-64 max-w-full" />
          <div className="flex gap-2 pt-1">
            <Bar className="h-6 w-24 rounded-full" />
            <Bar className="h-6 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </div>
    <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2 rounded-xl bg-base-200 p-4">
            <Bar className="h-3 w-20" />
            <Bar className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

export const AppointmentCardsSkeleton = ({ count = 3 }) => (
  <Frame label="Loading appointments" className="space-y-5">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="card border border-base-300 bg-base-100 p-5 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Bar className="h-10 w-10 flex-none rounded-full" />
          <div className="flex-1 space-y-2">
            <Bar className="h-4 w-40" />
            <Bar className="h-3 w-24" />
          </div>
          <Bar className="h-6 w-20 rounded-full" />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Bar className="h-16 rounded-xl" />
          <Bar className="h-16 rounded-xl" />
        </div>
      </div>
    ))}
  </Frame>
);

export const ScheduleSkeleton = () => (
  <Frame label="Loading schedule" className="card border border-base-300 bg-base-100 p-5 shadow-sm">
    <div className="space-y-2">
      <Bar className="h-5 w-32" />
      <Bar className="h-3 w-64 max-w-full" />
    </div>
    <div className="mt-6 space-y-4">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 border-t border-base-300 pt-4">
          <Bar className="h-4 w-16" />
          <Bar className="h-6 w-6 rounded-md" />
          <Bar className="h-10 rounded-lg" />
          <Bar className="h-10 rounded-lg" />
          <Bar className="h-10 rounded-lg" />
        </div>
      ))}
    </div>
  </Frame>
);

export const FormSkeleton = () => (
  <Frame label="Loading form" className="card border border-base-300 bg-base-100 p-5 shadow-sm">
    <div className="flex items-center gap-4">
      <Bar className="h-14 w-14 flex-none rounded-full" />
      <div className="flex-1 space-y-2">
        <Bar className="h-5 w-44" />
        <Bar className="h-3 w-64 max-w-full" />
      </div>
    </div>
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Bar className="h-3 w-28" />
          <Bar className="h-10 rounded-lg" />
        </div>
      ))}
    </div>
    <Bar className="mt-6 h-10 w-40 rounded-lg" />
  </Frame>
);

export const BookingSkeleton = () => (
  <Frame
    label="Preparing booking"
    className="mx-auto max-w-5xl space-y-6 px-6 py-10 lg:px-8"
  >
    <Bar className="h-4 w-32" />
    <div className="flex items-center gap-4">
      <Bar className="h-14 w-14 flex-none rounded-full" />
      <div className="space-y-2">
        <Bar className="h-6 w-64 max-w-full" />
        <Bar className="h-3 w-48" />
      </div>
    </div>
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
          <Bar className="h-4 w-32" />
          <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {Array.from({ length: 14 }).map((_, index) => (
              <Bar key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
          <Bar className="h-4 w-32" />
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Bar key={index} className="h-11 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
          <Bar className="h-4 w-28" />
          <div className="mt-5 space-y-4">
            <Bar className="h-16 rounded-xl" />
            <Bar className="h-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

export const DashboardSkeleton = () => (
  <Frame label="Loading dashboard" className="space-y-7">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-3">
        <Bar className="h-4 w-36" />
        <Bar className="h-8 w-64 max-w-full" />
        <Bar className="h-3 w-80 max-w-full" />
      </div>
      <Bar className="h-16 w-48 rounded-xl" />
    </div>
    <StatGridSkeleton />
    <TableSkeleton rows={4} columns={4} label="Loading recent appointments" />
  </Frame>
);

export default Frame;
