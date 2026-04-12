/** True for absolute http(s) URLs (open in new tab from in-app links). */
export function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

/** Use on `<a>` or Next `<Link>` when href may be external. */
export function externalLinkProps(href: string) {
  return isExternalHref(href)
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : ({} as const);
}
