"use client";
import React, { useState } from "react";
import Sections from "@/components/component/Sections";
import ChatPanel from "./components/ChatPanel";
import ProjectAnalysis from "./components/ProjectAnalysis";
import FlowBuilder from "./components/FlowBuilder";

const sectionData = [
  { title: "AI", description: "Brainstorm and generate project ideas" },
  { title: "FlowCharts", description: "Visualize project structure" },
  { title: "Project Analysis", description: "Analyze projects with AI" },
];

const ProjectPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <header className="flex flex-col justify-center items-center py-6 ">
        <Sections sections={sectionData} onSelect={(idx) => setActiveIndex(idx)} />
      </header>
      <main className="flex-1 flex justify-center items-start p-6">
          {activeIndex === 0 && <ChatPanel />}
          {activeIndex === 1 && <FlowBuilder />}
          {activeIndex === 2 && <ProjectAnalysis />}
      </main>
    </div>
  );
};

export default ProjectPage;
