import React, { useState } from 'react';
import { MINI_PROJECTS } from '../data/projects';
import { MiniProjectDef } from '../types/course';
import { Award, Cpu, CheckCircle, ChevronRight, Shield, Layers, HelpCircle } from 'lucide-react';

export const MiniProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<MiniProjectDef>(MINI_PROJECTS[0]);

  const categories = [
    'All',
    'Security',
    'Industrial Automation',
    'Measurement',
    'Digital Computing',
    'Gaming & Entertainment',
  ];

  const filtered =
    selectedCategory === 'All'
      ? MINI_PROJECTS
      : MINI_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border border-t-4 border-t-amber-500 shadow-sm transition-colors">
        {/* Playful Ambient Blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-mod2/20 to-brand-mid/20 blur-3xl opacity-60 animate-blob-drift-1" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-mod1/20 to-mod3/20 blur-3xl opacity-50 animate-blob-drift-2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-vivid-mod2 uppercase tracking-wider flex items-center gap-1.5 font-sans font-bold">
              <Award className="w-4 h-4 text-white" />
              Term Work Mini-Project Repository • 5 Marks TW Component
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-ink-900 dark:text-white">
            <span className="text-brand-gradient">Digital Electronics</span> Mini-Projects
          </h1>
          <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-cream-muted mt-2 max-w-2xl font-medium leading-relaxed">
            Curated undergraduate hardware project ideas designed with standard 74xx TTL ICs and CMOS circuits. Includes detailed specifications, required components, testing procedures, and evaluation rubrics.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-cream-border dark:border-darklab-border">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold transition-all ${
                  selectedCategory === cat
                    ? 'btn-brand-gradient !text-white shadow-brand'
                    : 'bg-cream-soft dark:bg-darklab-subtle text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card hover:text-ink-900 border border-cream-border dark:border-darklab-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Project List */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setActiveProject(proj)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all border-t-4 border-t-amber-500 ${
                activeProject.id === proj.id
                  ? 'bg-mod2-wash dark:bg-darklab-card border-mod2 text-ink-900 dark:text-white shadow-amber ring-2 ring-mod2 scale-[1.01]'
                  : 'bg-white dark:bg-darklab-card border-cream-border dark:border-darklab-border text-ink-900 dark:text-white hover:border-brand-mid shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-mod2 text-white">
                  Project {proj.id}
                </span>
                <span
                  className={`text-[10px] font-sans font-bold ${
                    proj.complexity === 'Beginner'
                      ? 'badge-vivid-mod3'
                      : proj.complexity === 'Intermediate'
                      ? 'badge-vivid-brand'
                      : 'badge-vivid-mod4'
                  }`}
                >
                  {proj.complexity}
                </span>
              </div>
              <h3 className="text-sm font-sans font-bold mt-2 text-ink-900 dark:text-white">{proj.title}</h3>
              <p className="text-xs font-sans text-ink-600 dark:text-cream-muted line-clamp-2 mt-1 leading-relaxed font-medium">
                {proj.abstract}
              </p>
              <div className="flex items-center justify-between text-[11px] font-sans text-ink-600 dark:text-cream-muted mt-3 pt-2 border-t border-cream-border dark:border-darklab-border font-bold">
                <span>{proj.category}</span>
                <span className="text-brand-mid dark:text-purple-400 flex items-center gap-0.5 font-bold">
                  View Specs <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Selected Project Detail */}
        <div className="lg:col-span-7 bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-3xl card-vivid-mod2 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-border dark:border-darklab-border pb-4">
            <div>
              <span className="text-xs font-sans text-brand-mid dark:text-purple-400 font-bold">
                {activeProject.category} • Target: <span className="font-mono">{activeProject.targetCO}</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-ink-900 dark:text-white mt-1">
                {activeProject.title}
              </h2>
            </div>
            <span
              className={`text-xs font-sans font-bold ${
                activeProject.complexity === 'Beginner'
                  ? 'badge-vivid-mod3'
                  : activeProject.complexity === 'Intermediate'
                  ? 'badge-vivid-brand'
                  : 'badge-vivid-mod4'
              }`}
            >
              {activeProject.complexity} Complexity
            </span>
          </div>

          {/* Abstract */}
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-brand-mid dark:text-purple-400 mb-1">
              Project Abstract
            </h4>
            <p className="text-xs sm:text-sm font-sans text-ink-800 dark:text-cream-paper leading-relaxed bg-cream-soft dark:bg-darklab-base p-4 rounded-2xl border border-cream-border dark:border-darklab-border font-medium">
              {activeProject.abstract}
            </p>
          </div>

          {/* Specifications */}
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-mod2-dark dark:text-mod2 mb-2">
              Functional Specifications
            </h4>
            <ul className="space-y-2 text-xs font-sans text-ink-800 dark:text-cream-paper">
              {activeProject.specifications.map((spec, i) => (
                <li key={i} className="flex items-start gap-2 bg-cream-soft dark:bg-darklab-base p-3 rounded-xl border border-cream-border dark:border-darklab-border font-medium">
                  <CheckCircle className="w-4 h-4 text-mod3 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required ICs */}
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-mod4 mb-2">
              Required TTL/CMOS Hardware ICs
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeProject.requiredICs.map((ic, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-mod4 !text-white font-mono text-xs font-bold shadow-violet"
                >
                  {ic}
                </span>
              ))}
            </div>
          </div>

          {/* Testing Steps */}
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-mod1 mb-2">
              Laboratory Testing & Verification Steps
            </h4>
            <div className="space-y-1.5 text-xs text-ink-800 dark:text-cream-paper font-sans">
              {activeProject.testingSteps.map((step, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border flex items-start gap-2">
                  <span className="text-mod2 font-bold">{i + 1}.</span>
                  <span className="font-sans font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Rubric */}
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-brand-mid dark:text-purple-400 mb-2">
              Grading Rubric (Total: 100%)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeProject.rubric.map((r, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-1 text-xs hover:border-brand-mid transition-all font-sans">
                  <div className="flex items-center justify-between">
                    <span className="badge-vivid-brand">{r.weight}%</span>
                  </div>
                  <div className="font-bold text-ink-900 dark:text-white pt-1">{r.criterion}</div>
                  <p className="text-[11px] text-ink-600 dark:text-cream-muted leading-snug font-medium">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
