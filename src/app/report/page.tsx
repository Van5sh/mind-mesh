"use client";

import React, { useState } from "react";
import Sections from "@/components/component/Sections";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GeneratedReport from "./components/GeneratedReport";
import Customization from "./components/Customization";

interface SectionProps {
  title: string;
  description: string;
}

const ReportPage: React.FC = () => {
  const [report, setReport] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gray-50 p-6">
      {/* Header Section */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">MindMesh Report Generator</h1>
        <p className="text-gray-500">Customize your report and generate AI-powered insights.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <Card className="p-6 shadow-md border rounded-2xl bg-white">
          <Customization onGenerate={(generatedReport) => setReport(generatedReport)} />
        </Card> 

        <Card className="p-6 shadow-md border rounded-2xl bg-white">
          <GeneratedReport report={report} />
        </Card>
      </div>
    </div>
  );
};

export default ReportPage;
