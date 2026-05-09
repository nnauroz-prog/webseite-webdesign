/**
 * Layout for the public site routes. The root layout already provides
 * <html> and <body>; this just makes sure the public area renders without
 * inheriting any future dashboard chrome we might add at parent levels.
 */
export default function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
