import React from 'react';
import { BookOpen, ShieldCheck, Heart, Sparkles, School } from 'lucide-react';
import { SITE_CONFIG } from '../../data/site.config';
import { COURSE_OUTCOMES } from '../../data/cos';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-[#e2d8c6] dark:border-slate-800/80 bg-[#f4efe4]/90 dark:bg-[#090d16]/80 backdrop-blur-xl py-12 px-4 sm:px-6 lg:px-8 text-slate-700 dark:text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Course Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-mono font-bold text-lg">
              <Sparkles className="w-5 h-5 text-cyan-700 dark:text-cyan-400" />
              <span>Virtual DSD Lab • {SITE_CONFIG.course.code}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-stone-400 max-w-md leading-relaxed">
              {SITE_CONFIG.course.description}
            </p>
            <div className="pt-2 text-xs font-mono text-slate-500 dark:text-stone-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-stone-300">
                <School className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                <span>{SITE_CONFIG.institution.collegeName} ({SITE_CONFIG.institution.collegeAbbr})</span>
              </div>
              <div>Affiliation: {SITE_CONFIG.institution.affiliation}</div>
              <div>Department: {SITE_CONFIG.institution.department}</div>
              <div>
                Structure: {SITE_CONFIG.course.totalTheoryHours}h Theory + {SITE_CONFIG.course.totalLabHours}h Lab ({SITE_CONFIG.course.totalCredits} Credits)
              </div>
            </div>
          </div>

          {/* Col 2: Course Outcomes */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
              Course Outcomes (CO1-CO6)
            </h4>
            <ul className="text-xs text-slate-700 dark:text-stone-400 space-y-1.5 font-mono">
              {COURSE_OUTCOMES.map((co) => (
                <li key={co.id} className="flex items-start gap-1">
                  <span className="font-bold text-slate-900 dark:text-stone-200">{co.id}:</span>
                  <span className="truncate">{co.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Principles & Faculty Contact */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              Academic Standards & Faculty
            </h4>
            <ul className="text-xs text-slate-700 dark:text-stone-400 space-y-2">
              <li>• 100% Pure Client-Side Computation (Zero Backend)</li>
              <li>• Aligned with Mumbai University / SAKEC Curriculum</li>
              <li>• Bloom's Taxonomy Cognitive Level Mapping</li>
              <li className="pt-2 text-[11px] font-mono border-t border-[#ded4c2] dark:border-stone-800 text-slate-600 dark:text-stone-400">
                <strong className="text-slate-900 dark:text-stone-300">Faculty Coordinator:</strong><br />
                {SITE_CONFIG.facultyCoordinator.namePlaceholder}<br />
                {SITE_CONFIG.facultyCoordinator.emailPlaceholder}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#ded4c2] dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-stone-400 gap-3 font-mono">
          <div>
            © {new Date().getFullYear()} {SITE_CONFIG.institution.collegeAbbr} • Digital System Design Course Workbench
          </div>
          <div className="flex items-center gap-1">
            <span>Built for engineering learners with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
};
