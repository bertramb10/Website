import CopyEmailButton from './components/CopyEmailButton';
import ResumeButtons from './components/ResumeButtons';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BB
            </h1>
            <div className="flex gap-6">
              <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
              <a href="#skills" className="hover:text-blue-600 transition-colors">Skills</a>
              <a href="#projects" className="hover:text-blue-600 transition-colors">Projects</a>
              <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Bertram Bregnhøj
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300">
              Software Developer
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Building modern, efficient, and user-friendly applications with a passion for clean code and innovative solutions.
            </p>
            <div className="flex gap-4 justify-center pt-4 flex-wrap">
              <a
                href="#projects"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-6 py-3 border border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-600 rounded-lg font-medium transition-colors"
              >
                Get in Touch
              </a>
            </div>
            <div className="pt-6">
              <ResumeButtons />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Me</h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-lg">
            <p>
              I&apos;m a software developer with experience across multiple programming languages and frameworks.
              Currently seeking opportunities to contribute to innovative projects and collaborate with talented teams.
            </p>
            <p>
              My approach combines technical expertise with creative problem-solving, always focusing on
              building solutions that are both functional and maintainable.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Technical Skills</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Languages */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'JavaScript', 'TypeScript', 'C#', 'C++'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Frontend */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-purple-600">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend & Tools */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-pink-600">Backend & Tools</h3>
              <div className="flex flex-wrap gap-2">
                {['Node.js', 'Git', 'REST APIs', 'Azure'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Project cards will go here */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-600 transition-colors">
              <h3 className="text-2xl font-semibold mb-4">Smart Job Application System</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                An intelligent job search and application automation tool that analyzes job postings,
                extracts keywords, and generates tailored cover letters based on your resume.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                  Next.js
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                  Keyword Extraction
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                  Automation
                </span>
              </div>
              <div className="flex gap-3 items-center flex-wrap">
                <a
                  href="/jobs"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-block"
                >
                  Search Jobs →
                </a>
                <a
                  href="/job-analyzer"
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-600 rounded-lg font-medium transition-colors inline-block"
                >
                  Analyzer Tool
                </a>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Working</span>
              </div>
            </div>

            {/* Placeholder for future projects */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
              <p className="text-slate-400">More projects coming soon...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Get In Touch</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            I&apos;m currently looking for new opportunities. Whether you have a question or just want to say hi,
            I&apos;ll try my best to get back to you!
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <a
              href="https://github.com/bertramb10"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/bertram-alexander-bregnh%C3%B8j-petersen-2692172a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              LinkedIn
            </a>
            <CopyEmailButton email="bertramb10@yahoo.dk" />
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">View or download my resume:</p>
            <ResumeButtons />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-slate-500">
          <p>&copy; 2025 Bertram Bregnhøj. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
