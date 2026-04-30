type StructuredDataValue =
  | Record<string, unknown>
  | Array<Record<string, unknown>>;

function normalizeStructuredData(
  data: unknown
): Array<Record<string, unknown>> {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === 'object' && !Array.isArray(item)
    );
  }

  if (typeof data === 'object') {
    return [data as Record<string, unknown>];
  }

  return [];
}

export function StructuredData({
  data,
}: {
  data?: StructuredDataValue | unknown;
}) {
  const entries = normalizeStructuredData(data);

  if (!entries.length) {
    return null;
  }

  return (
    <>
      {entries.map((entry, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </>
  );
}
