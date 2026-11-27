const files = import.meta.glob<string>("../../assets/twemoji/*.svg", {
  eager: true,
  query: "?no-inline",
  import: "default",
});

export const twemojiUrls: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path.slice(path.lastIndexOf("/") + 1, -4),
    url,
  ]),
);
