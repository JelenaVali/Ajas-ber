import type { Metadata } from "next";
import { HistoryView } from "@/components/HistoryView";
import { getMessages } from "@/lib/i18n";

const messages = getMessages();

export const metadata: Metadata = {
  title: `${messages.history.title} – ${messages.app.name}`,
};

// Ajalugu on seadmepõhine: seadme tunnus on brauseris, seega laadib kirjed
// kliendikomponent, mitte server.
export default function HistoryPage() {
  return <HistoryView />;
}
