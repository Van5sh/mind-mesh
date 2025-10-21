import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-900 dark:text-white font-sans">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="relative flex flex-col items-center justify-center px-6 py-24 sm:px-12 lg:px-24 text-center space-y-20">
        
        {/* Hero Section */}
        <div className="space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-sm font-medium backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            AI-Powered Knowledge Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight">
            Welcome to{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-gradient">
                MindMesh
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-full blur-sm"></span>
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Your AI-driven workspace for seamless knowledge management, ideation, and document intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href="/getstarted"
              className="group relative rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-10 py-4 text-base sm:text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="#learn-more"
              className="group rounded-full border-2 border-gray-300 dark:border-gray-700 px-10 py-4 font-semibold text-base sm:text-lg hover:bg-gray-100 dark:hover:bg-gray-900 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl mt-10">
          {[
            {
              title: "Knowledge Management",
              desc: "Organize and connect your ideas seamlessly with intelligent linking",
              icon: "🧠",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              title: "Project Ideation",
              desc: "Transform thoughts into actionable projects with AI assistance",
              icon: "💡",
              gradient: "from-indigo-500 to-purple-500",
            },
            {
              title: "Document Intelligence",
              desc: "AI-powered insights and analysis from your documents",
              icon: "📄",
              gradient: "from-purple-500 to-pink-500",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              
              <h3 className={`font-bold text-xl mb-3 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                {feature.title}
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>

              {/* Decorative corner */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* About / Description */}
        <div className="relative max-w-4xl mx-auto mt-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-3xl blur-2xl"></div>
          <div className="relative p-10 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Intelligence Meets Innovation
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              MindMesh learns from your files, chats, and reports to build a dynamic
              knowledge graph connecting ideas, documents, and people — turning
              information into insight. Experience the future of intelligent knowledge management.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative flex flex-wrap justify-center items-center gap-8 py-16 border-t border-gray-200 dark:border-gray-800 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-950/50"></div>
        {[
          {
            href: "https://nextjs.org/learn",
            label: "Learn",
            icon: "/file.svg",
          },
          {
            href: "https://vercel.com/templates?framework=next.js",
            label: "Examples",
            icon: "/window.svg",
          },
          {
            href: "https://nextjs.org",
            label: "Go to nextjs.org →",
            icon: "/globe.svg",
          },
        ].map((link, i) => (
          <a
            key={i}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-3 px-5 py-3 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 group"
          >
            <Image
              aria-hidden
              src={link.icon}
              alt={`${link.label} icon`}
              width={18}
              height={18}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span className="font-medium">{link.label}</span>
          </a>
        ))}
      </footer>
    </div>
  );
}
