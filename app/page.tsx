'use client';

import { useState } from 'react';
import CopyEmailButton from './components/CopyEmailButton';
import ResumeButtons from './components/ResumeButtons';

export default function Home() {
  const [imageError, setImageError] = useState(false);

  const skills = {
    languages: ['Python', 'JavaScript', 'TypeScript', 'C#', 'C++'],
    frontend: ['React', 'Next.js', 'HTML/CSS', 'Tailwind CSS'],
    backend: ['Node.js', 'REST APIs', 'Git', 'Azure']
  };

  const projects = [
    {
      title: 'ClearCraft',
      description: 'Professionel webdesign service der leverer moderne, responsive hjemmesider til små og mellemstore virksomheder. Komplet med demo-templates og kundeportal.',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      link: 'https://clearcraft-website.vercel.app',
      color: 'violet'
    },
    {
      title: 'Job System',
      description: 'Intelligent job-søgnings og analyse værktøj der automatisk finder relevante stillinger, ekstraherer nøgleord og hjælper med at målrette ansøgninger.',
      tags: ['Next.js', 'TypeScript', 'API Integration', 'Automation'],
      link: '/jobs',
      color: 'blue'
    },
    {
      title: 'FoodPrint',
      description: 'Bæredygtig mad-tracking app der hjælper brugere med at forstå og reducere deres klimaaftryk gennem deres kostvalg og indkøbsvaner.',
      tags: ['React', 'Node.js', 'Database', 'Analytics'],
      link: '#',
      color: 'emerald'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* CSS for animations and shapes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-wave { animation: wave 20s linear infinite; }
        .project-card {
          clip-path: polygon(15% 0%, 85% 0%, 100% 8%, 100% 100%, 0% 100%, 0% 8%);
        }
        .skill-badge {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#" className="relative group">
              <div className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg font-bold text-lg transition-transform group-hover:scale-105">
                BB
              </div>
            </a>

            {/* Contact Button */}
            <a
              href="#contact"
              className="px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              Kontakt
            </a>
          </div>
        </div>

        {/* Wavy line under navbar */}
        <div className="relative h-8 overflow-hidden">
          <svg
            className="absolute w-[200%] h-full animate-wave"
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C120,35 240,5 360,20 C480,35 600,5 720,20 C840,35 960,5 1080,20 C1200,35 1320,5 1440,20 C1560,35 1680,5 1800,20 C1920,35 2040,5 2160,20 C2280,35 2400,5 2520,20 C2640,35 2760,5 2880,20"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen">
        {/* Background gradient blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Image + About */}
            <div className="space-y-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl blur opacity-30" />
                <div className="relative w-64 h-64 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                  {!imageError ? (
                    <img
                      src="/profile.jpg"
                      alt="Bertram Bregnhøj"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600/20 to-blue-600/20">
                      <span className="text-6xl font-bold text-white/20">BB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* About Me */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">About Me</h2>
                <div className="space-y-3 text-slate-300 leading-relaxed">
                  <p>
                    Jeg er en softwareudvikler med passion for at bygge moderne og brugervenlige applikationer.
                  </p>
                  <p>
                    Med erfaring i både frontend og backend, fokuserer jeg på at skabe løsninger der er både funktionelle og æstetiske.
                  </p>
                  <p>
                    Udover udvikling driver jeg ClearCraft, hvor jeg hjælper små virksomheder med professionelle hjemmesider.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Experience & Skills */}
            <div className="space-y-8">
              {/* Experience Badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full blur opacity-50" />
                  <div className="relative px-8 py-3 bg-slate-900 border border-violet-500/30 rounded-full">
                    <span className="text-lg font-semibold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                      Experience
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Languages */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-violet-400">Languages</h3>
                  <div className="space-y-2">
                    {skills.languages.map((skill) => (
                      <div key={skill} className="skill-badge px-4 py-2 rounded-lg text-slate-300 text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frontend */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Frontend</h3>
                  <div className="space-y-2">
                    {skills.frontend.map((skill) => (
                      <div key={skill} className="skill-badge px-4 py-2 rounded-lg text-slate-300 text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backend and Tools */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-400">Backend & Tools</h3>
                  <div className="space-y-2">
                    {skills.backend.map((skill) => (
                      <div key={skill} className="skill-badge px-4 py-2 rounded-lg text-slate-300 text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resume Buttons */}
              <div className="pt-4">
                <ResumeButtons />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative py-20 px-6">
        {/* Section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-slate-400 text-lg">Udvalgte projekter jeg har arbejdet på</p>
          </div>

          {/* Project Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-b ${
                  project.color === 'violet' ? 'from-violet-600/50 to-violet-600/0' :
                  project.color === 'blue' ? 'from-blue-600/50 to-blue-600/0' :
                  'from-emerald-600/50 to-emerald-600/0'
                } rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Card */}
                <div className="project-card relative bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 h-full flex flex-col transition-all duration-300 group-hover:border-slate-600 group-hover:-translate-y-2">
                  {/* Top accent */}
                  <div className={`absolute top-0 left-[15%] right-[15%] h-1 ${
                    project.color === 'violet' ? 'bg-gradient-to-r from-violet-600 to-purple-600' :
                    project.color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' :
                    'bg-gradient-to-r from-emerald-600 to-teal-600'
                  } rounded-b-full`} />

                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-4 ${
                    project.color === 'violet' ? 'text-violet-400' :
                    project.color === 'blue' ? 'text-blue-400' :
                    'text-emerald-400'
                  }`}>
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded text-xs ${
                          project.color === 'violet' ? 'bg-violet-900/50 text-violet-300' :
                          project.color === 'blue' ? 'bg-blue-900/50 text-blue-300' :
                          'bg-emerald-900/50 text-emerald-300'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Link Button */}
                  <a
                    href={project.link}
                    target={project.link.startsWith('http') ? '_blank' : '_self'}
                    rel={project.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      project.color === 'violet' ? 'bg-violet-600 hover:bg-violet-700' :
                      project.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                      'bg-emerald-600 hover:bg-emerald-700'
                    } text-white`}
                  >
                    Se projekt
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Kontakt
            </span>
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Har du et projekt i tankerne eller vil du bare sige hej? Skriv endelig!
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <a
              href="https://github.com/bertramb10"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/bertram-alexander-bregnh%C3%B8j-petersen-2692172a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              LinkedIn
            </a>
            <CopyEmailButton email="bertramb10@yahoo.dk" />
          </div>
          <div className="border-t border-slate-800 pt-8">
            <p className="text-sm text-slate-500 mb-4">Download mit CV:</p>
            <ResumeButtons />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-slate-500">
          <p>&copy; 2025 Bertram Bregnhøj</p>
        </div>
      </footer>
    </div>
  );
}
