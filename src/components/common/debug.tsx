import React from "react";
import { Card } from "../ui/card";

function syntaxHighlight(json: string) {
  if (typeof json != "string") {
    json = JSON.stringify(json, null, "\t");
  }

  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "number";
      if (match.startsWith('"')) {
        if (match.endsWith(":")) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    },
  );
}

export default function Debug({
  data,
  title = "",
}: {
  data: Record<string, unknown>[] | string;
  title?: string;
}) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Card className="max-h-96 p-4">
      <div className="mb-4">
        {/* <h1 className="text-2xl font-bold">Debug </h1> */}
        <h2 className="text-lg font-bold">{`Debug ${title}`}</h2>
      </div>
      <Card className="h-[280px] w-full overflow-auto">
        <code
          dangerouslySetInnerHTML={{
            __html: syntaxHighlight(
              typeof data === "string" ? data : JSON.stringify(data, null, 2),
            ),
          }}
        />
      </Card>
      <p className="mt-2 text-foreground/60">
        This component is only visible in development mode
      </p>
    </Card>
  );
}
