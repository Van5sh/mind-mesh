import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-12 row-start-2 items-center text-center max-w-4xl">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-blue-600 dark:text-blue-400">MindMesh</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300">
            Your AI-driven workspace for knowledge management
          </p>
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
          MindMesh combines knowledge management, project ideation, and document intelligence 
          into a single platform. It automatically learns from your files, chats, and reports 
          to build a semantic knowledge graph that connects ideas, documents, and people.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-4">
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50">
            <h3 className="font-semibold text-lg mb-2">Knowledge Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Organize and connect your ideas seamlessly
            </p>
          </div>
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50">
            <h3 className="font-semibold text-lg mb-2">Project Ideation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transform thoughts into actionable projects
            </p>
          </div>
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50">
            <h3 className="font-semibold text-lg mb-2">Document Intelligence</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered insights from your documents
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <a className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-12 px-8 w-full sm:w-auto"
              href="#get-started"
          >
            Get Started
          </a>
          <a
        className="rounded-full border border-solid border-gray-300 dark:border-gray-700 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-900 font-medium text-sm sm:text-base h-12 px-8 w-full sm:w-auto"
        href="#learn-more"
          >
        Learn More
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
