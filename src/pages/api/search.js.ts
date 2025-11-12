const search = import.meta.glob("../../stubs/output/search.js", {
  query: "?raw"
});
const js = (await Object.values(search)[0]() as any).default;

export function GET(_: unknown) {
  return new Response(
    js
  );
}
