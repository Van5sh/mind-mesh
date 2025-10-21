"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function Customization({ onGenerate }: { onGenerate: (report: any) => void }) {
  const [format, setFormat] = useState("Summary");
  const [topic, setTopic] = useState("");
  

  return (
    <div className="flex flex-col space-y-4 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-semibold">🧩 Customize Report</h2>

    <div>
      <Label>Select Report Format</Label>
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="w-full border rounded-md p-2"
      >
        <option>Summary</option>
        <option>Detailed</option>
        <option>Technical</option>
        <option>Presentation</option>
      </select>
    </div>

      <div>
        <Label>Topic or Reference</Label>
        <Input
          placeholder="e.g. AI in Healthcare or @research/ai_report"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <Button >
        Generate Customized Report
      </Button>
    </div>
  );
}
