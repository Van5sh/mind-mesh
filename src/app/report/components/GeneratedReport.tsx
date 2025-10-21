"use client";
export default function GeneratedReport({ report }: { report: any }) {
  if (!report)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 italic">
        No report generated yet.
      </div>
    );

  return (
    <div className="bg-white shadow-md rounded-xl p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">{report.title}</h2>
      <div className="whitespace-pre-line text-gray-800">{report.content}</div>
    </div>
  );
}
