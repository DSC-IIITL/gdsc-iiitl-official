import Events from "@/components/Events";

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Events.Layout>{children}</Events.Layout>;
}
