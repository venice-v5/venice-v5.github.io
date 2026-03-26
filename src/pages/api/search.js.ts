const search = import.meta.glob("../../stubs/output/search.js", {
  eager: true,
  query: "?raw",
}) as Record<string, { default: string }>;

const js = Object.values(search)[0]?.default ?? "";

export function GET(_: unknown) {
  return new Response(js, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
    },
  });
}
