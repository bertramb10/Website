'use client';

import { useState } from 'react';
import CopyEmailButton from './components/CopyEmailButton';
import ResumeButtons from './components/ResumeButtons';

export default function Home() {
  const [imageError, setImageError] = useState(false);
  const [language, setLanguage] = useState<'da' | 'en'>('da');

  const skills = {
    languages: ['Python', 'JavaScript', 'TypeScript', 'C#', 'C++'],
    frontend: ['React', 'Next.js', 'Angular', 'HTML/CSS', 'Tailwind CSS'],
    backend: ['Node.js', 'MySQL', 'REST APIs', 'Git', 'Azure/DevOps'],
    methodology: ['Scrum', 'CI/CD'],
    soft: language === 'da'
      ? ['Dialogorienteret', 'Rolig & afbalanceret', 'Ansvarsbevidst', 'God teamplayer']
      : ['Communication-oriented', 'Calm & balanced', 'Responsible', 'Good team player']
  };

  const t = {
    contact: language === 'da' ? 'Kontakt' : 'Contact',
    experience: language === 'da' ? 'Experience' : 'Experience',
    aboutMe: language === 'da' ? 'About Me' : 'About Me',
    aboutText: language === 'da' ? {
      p1: 'Jeg er en softwareudvikler med passion for at bygge moderne og brugervenlige applikationer.',
      p2: 'Med erfaring i både frontend og backend, fokuserer jeg på at skabe løsninger der er både funktionelle og æstetiske.',
      p3: 'Udover udvikling driver jeg ClearCraft, hvor jeg hjælper små virksomheder med professionelle hjemmesider.'
    } : {
      p1: 'I am a software developer with a passion for building modern and user-friendly applications.',
      p2: 'With experience in both frontend and backend, I focus on creating solutions that are both functional and aesthetic.',
      p3: 'Beyond development, I run ClearCraft, where I help small businesses with professional websites.'
    },
    projects: language === 'da' ? 'Projects' : 'Projects',
    projectsSubtitle: language === 'da' ? 'Udvalgte projekter jeg har arbejdet på' : 'Selected projects I have worked on',
    seeProject: language === 'da' ? 'Se projekt' : 'View project',
    contactTitle: language === 'da' ? 'Kontakt' : 'Contact',
    contactText: language === 'da'
      ? 'Har du et projekt i tankerne eller vil du bare sige hej? Skriv endelig!'
      : 'Have a project in mind or just want to say hi? Feel free to reach out!',
    downloadCV: language === 'da' ? 'Download mit CV:' : 'Download my CV:'
  };

  const projects = [
    {
      title: 'ClearCraft',
      description: language === 'da'
        ? 'Professionel webdesign service der leverer moderne, responsive hjemmesider til små og mellemstore virksomheder. Komplet med demo-templates og kundeportal.'
        : 'Professional web design service delivering modern, responsive websites for small and medium-sized businesses. Complete with demo templates and client portal.',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      link: 'https://clearcraft-website.vercel.app',
      color: 'violet'
    },
    {
      title: 'Smart Job Post Finding System',
      description: language === 'da'
        ? 'Intelligent job-søgnings og analyse værktøj der automatisk finder relevante stillinger, ekstraherer nøgleord og hjælper med at målrette ansøgninger.'
        : 'Intelligent job search and analysis tool that automatically finds relevant positions, extracts keywords, and helps target applications.',
      tags: ['Next.js', 'TypeScript', 'API Integration', 'Automation'],
      link: '/jobs',
      color: 'blue'
    },
    {
      title: 'Food/Drink Program',
      description: language === 'da'
        ? 'Bæredygtig mad-tracking app der hjælper brugere med at forstå og reducere deres klimaaftryk gennem deres kostvalg og indkøbsvaner.'
        : 'Sustainable food tracking app that helps users understand and reduce their carbon footprint through their dietary choices and shopping habits.',
      tags: ['React', 'Node.js', 'Database', 'Analytics'],
      link: '#',
      color: 'emerald'
    },
    {
      title: 'Dota 2 Hero Picker',
      description: language === 'da'
        ? 'Intelligent hero-anbefalingssystem der analyserer team-komposition og modstandernes picks for at foreslå optimale hero-valg baseret på synergier og counters.'
        : 'Intelligent hero recommendation system that analyzes team composition and enemy picks to suggest optimal hero choices based on synergies and counters.',
      tags: ['Next.js', 'TypeScript', 'Algorithm', 'Game Analytics'],
      link: '/dota-picker',
      color: 'red'
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
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float-vertical {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(5deg); }
          66% { transform: translateY(30px) rotate(-5deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-wave { animation: wave 20s linear infinite; }
        .animate-rotate-slow { animation: rotate-slow 30s linear infinite; }
        .animate-float-vertical { animation: float-vertical 8s ease-in-out infinite; }
        .project-card {
          clip-path: polygon(15% 0%, 85% 0%, 100% 8%, 100% 100%, 0% 100%, 0% 8%);
        }
        .skill-badge {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo - Stylized BB */}
            <a href="#" className="relative group">
              <div className="relative flex items-center">
                {/* Logo container with gradient border */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-0.5">
                      {/* First B - stylized */}
                      <span className="text-2xl font-black bg-gradient-to-br from-violet-400 to-violet-600 bg-clip-text text-transparent" style={{ fontFamily: 'system-ui' }}>
                        B
                      </span>
                      {/* Second B - slightly offset */}
                      <span className="text-2xl font-black bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent -ml-1" style={{ fontFamily: 'system-ui' }}>
                        B
                      </span>
                    </div>
                  </div>
                </div>
                {/* Dot accent */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" />
              </div>
            </a>

            {/* Language + Contact */}
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('da')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    language === 'da'
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  DA
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    language === 'en'
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Contact Button */}
              <a
                href="#contact"
                className="px-5 py-2 bg-slate-800 border border-slate-700 rounded-lg font-medium hover:bg-slate-700 hover:border-violet-500/50 transition-all"
              >
                {t.contact}
              </a>
            </div>
          </div>
        </div>

        {/* Wavy line under navbar */}
        <div className="relative h-8 overflow-hidden bg-slate-950">
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
      <section className="relative pt-32 pb-20 px-6 min-h-screen overflow-hidden">
        {/* Background gradient blobs - multiple layers for depth */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-1/4 w-[450px] h-[450px] bg-blue-600/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }} />

        {/* Decorative circles */}
        <div className="absolute top-60 right-20 w-24 h-24 border-2 border-blue-500/25 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-40 left-10 w-48 h-48 border border-purple-500/20 rounded-full animate-rotate-slow" />
        <div className="absolute top-1/4 left-1/3 w-32 h-32 border-2 border-violet-400/15 rounded-full animate-float" style={{ animationDelay: '2.5s' }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Image + About */}
            <div className="relative space-y-8">
              {/* Floating shapes column on the left */}
              <div className="absolute -left-20 top-0 bottom-0 w-16 hidden lg:block">
                {/* Circle 1 */}
                <div className="absolute top-[10%] w-12 h-12 border-2 border-violet-500/30 rounded-full animate-float-vertical" />
                {/* Square 1 */}
                <div className="absolute top-[25%] w-10 h-10 border-2 border-blue-500/25 rounded-lg animate-float-vertical" style={{ animationDelay: '1s' }} />
                {/* Circle 2 */}
                <div className="absolute top-[45%] w-14 h-14 border-2 border-purple-500/30 rounded-full animate-float-vertical" style={{ animationDelay: '2s' }} />
                {/* Triangle-like rotated square */}
                <div className="absolute top-[60%] w-11 h-11 border-2 border-violet-400/25 rounded-lg rotate-45 animate-float-vertical" style={{ animationDelay: '3s' }} />
                {/* Circle 3 */}
                <div className="absolute top-[80%] w-13 h-13 border-2 border-blue-400/30 rounded-full animate-float-vertical" style={{ animationDelay: '1.5s' }} />
                {/* Small square */}
                <div className="absolute top-[95%] w-8 h-8 border-2 border-purple-400/25 rounded-lg animate-float-vertical" style={{ animationDelay: '2.5s' }} />
              </div>
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
                <h2 className="text-2xl font-bold text-white">{t.aboutMe}</h2>
                <div className="space-y-3 text-slate-300 leading-relaxed" style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}>
                  <p>{t.aboutText.p1}</p>
                  <p>{t.aboutText.p2}</p>
                  <p>{t.aboutText.p3}</p>
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
                      {t.experience}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="space-y-6">
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

                {/* Second row - Methodology & Soft Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Methodology */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400">Methodology</h3>
                    <div className="space-y-2">
                      {skills.methodology.map((skill) => (
                        <div key={skill} className="skill-badge px-4 py-2 rounded-lg text-slate-300 text-sm">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Soft Skills */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-emerald-400">Soft Skills</h3>
                    <div className="space-y-2">
                      {skills.soft.map((skill) => (
                        <div key={skill} className="skill-badge px-4 py-2 rounded-lg text-slate-300 text-sm">
                          {skill}
                        </div>
                      ))}
                    </div>
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
      <section id="projects" className="relative py-20 px-6 overflow-hidden">
        {/* Section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

        {/* Background decorative elements */}
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 left-1/4 w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-10 w-32 h-32 border-2 border-violet-500/25 rounded-lg animate-rotate-slow" />
        <div className="absolute bottom-1/3 right-16 w-40 h-40 border-2 border-blue-500/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-2/3 left-1/3 w-28 h-28 border-2 border-purple-500/20 rounded-lg rotate-45 animate-float" style={{ animationDelay: '2.5s' }} />

        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                {t.projects}
              </span>
            </h2>
            <p className="text-slate-400 text-lg">{t.projectsSubtitle}</p>
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
                  project.color === 'red' ? 'from-red-600/50 to-red-600/0' :
                  'from-emerald-600/50 to-emerald-600/0'
                } rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Card */}
                <div className="project-card relative bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 h-full flex flex-col transition-all duration-300 group-hover:border-slate-600 group-hover:-translate-y-2">
                  {/* Top accent */}
                  <div className={`absolute top-0 left-[15%] right-[15%] h-1 ${
                    project.color === 'violet' ? 'bg-gradient-to-r from-violet-600 to-purple-600' :
                    project.color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' :
                    project.color === 'red' ? 'bg-gradient-to-r from-red-600 to-orange-600' :
                    'bg-gradient-to-r from-emerald-600 to-teal-600'
                  } rounded-b-full`} />

                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-4 ${
                    project.color === 'violet' ? 'text-violet-400' :
                    project.color === 'blue' ? 'text-blue-400' :
                    project.color === 'red' ? 'text-red-400' :
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
                          project.color === 'red' ? 'bg-red-900/50 text-red-300' :
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
                      project.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                      'bg-emerald-600 hover:bg-emerald-700'
                    } text-white`}
                  >
                    {t.seeProject}
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
      <section id="contact" className="relative py-20 px-6 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/2 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

        {/* Decorative shapes */}
        <div className="absolute top-1/4 right-10 w-28 h-28 border-2 border-violet-500/25 rounded-full animate-float" />
        <div className="absolute bottom-1/4 left-10 w-36 h-36 border-2 border-blue-500/20 rounded-lg animate-rotate-slow" />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 border-2 border-purple-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              {t.contactTitle}
            </span>
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            {t.contactText}
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
            <p className="text-sm text-slate-500 mb-4">{t.downloadCV}</p>
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
