import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyToClipboard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy}>
      <Copy className="w-4 h-4" />
      <span className="sr-only">Copy to clipboard</span>
    </Button>
  );
}
