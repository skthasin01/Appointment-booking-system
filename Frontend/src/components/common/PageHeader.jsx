const PageHeader = ({ eyebrow, title, description }) => (
  <div className="mx-auto max-w-3xl text-center">
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </p>
    )}
    <h1 className="mt-3 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
      {title}
    </h1>
    {description && (
      <p className="mt-4 text-base leading-7 text-base-content/60">
        {description}
      </p>
    )}
  </div>
);

export default PageHeader;
