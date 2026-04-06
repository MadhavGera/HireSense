import { MessageSquare } from "lucide-react";

export function FloatingChatButton() {
  return (
    <button className="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
      <MessageSquare className="w-5 h-5" fill="currentColor" />
    </button>
  );
}
