import React from 'react';
import { TEXTBOOKS, ONLINE_RESOURCES } from '../data/bibliography';
import { SITE_CONFIG } from '../data/site.config';
import { BookOpen, ExternalLink, Download, FileText, Video, School } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border border-t-4 border-t-amber-500 shadow-sm transition-colors">
        {/* Playful Ambient Blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-mod2/20 to-brand-mid/20 blur-3xl opacity-60 animate-blob-drift-1" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-mod3/20 to-mod4/20 blur-3xl opacity-50 animate-blob-drift-2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-vivid-mod2 uppercase tracking-wider flex items-center gap-1.5 font-sans font-bold">
              <BookOpen className="w-4 h-4 text-white" />
              Academic Bibliography & Learning Resources
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-ink-900 dark:text-white">
            <span className="text-brand-gradient">Textbooks, NPTEL Lectures</span> & Course References
          </h1>
          <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-cream-muted mt-2 max-w-2xl leading-relaxed font-medium">
            Standard prescribed textbooks and reference manuals aligned with University of Mumbai syllabus for {SITE_CONFIG.course.code} ({SITE_CONFIG.course.title}).
          </p>
        </div>
      </div>

      {/* Textbooks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-2">
          <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-mod2" />
            Prescribed Textbooks & Reference Manuals
          </h2>
          <span className="text-xs font-sans text-ink-600 dark:text-cream-muted font-bold">Library Classification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEXTBOOKS.map((book) => {
            const isTextbook = book.category === 'Textbook';
            return (
              <div
                key={book.id}
                className={`p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border ${
                  isTextbook ? 'card-vivid-mod2' : 'card-vivid-mod4'
                } space-y-3 shadow-sm hover:border-brand-mid transition-all flex flex-col justify-between`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={isTextbook ? 'badge-vivid-mod2' : 'badge-vivid-mod4'}
                    >
                      {book.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-ink-600 dark:text-cream-muted">
                      Modules: {book.relevantModules.map((m) => `M${m}`).join(', ')}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-ink-900 dark:text-white text-base leading-snug">{book.title}</h3>
                  <div className="text-xs text-ink-700 dark:text-cream-muted font-sans">
                    Authors: <span className="text-ink-900 dark:text-white font-bold">{book.authors}</span>
                  </div>
                  <div className="text-xs text-ink-700 dark:text-cream-muted font-sans">
                    {book.publisher} • {book.edition}
                  </div>
                </div>
                <div className="pt-3 border-t border-cream-border dark:border-darklab-border text-xs text-ink-700 dark:text-cream-muted leading-relaxed font-sans font-medium">
                  {book.notes}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Online NPTEL Video Lectures & Virtual Labs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-2">
          <h2 className="text-lg font-display font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-mod3" />
            Verified Online Video Lectures & National Virtual Labs
          </h2>
          <span className="text-xs font-sans text-ink-600 dark:text-cream-muted font-bold">IIT / IISc Free Open Access</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ONLINE_RESOURCES.map((res) => (
            <div
              key={res.id}
              className="p-6 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-mod3 space-y-3 shadow-sm hover:border-brand-mid transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="badge-vivid-mod3">
                    {res.provider}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-ink-600 dark:text-cream-muted">
                    Modules: {res.relevantModules.map((m) => `M${m}`).join(', ')}
                  </span>
                </div>
                <h3 className="font-display font-bold text-ink-900 dark:text-white text-base">{res.title}</h3>
                <p className="text-xs text-ink-700 dark:text-cream-muted leading-relaxed font-sans font-medium">{res.description}</p>
              </div>
              <div className="pt-3 border-t border-cream-border dark:border-darklab-border">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-mod3 hover:underline transition-colors"
                >
                  <span>Open Online Course</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Links & Department Verification */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border card-vivid-brand space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-display font-bold text-ink-900 dark:text-white">
          <School className="w-4 h-4 text-brand-mid" />
          <span>Institutional Department & Curriculum Information</span>
        </div>
        <p className="text-xs text-ink-700 dark:text-cream-muted leading-relaxed max-w-3xl font-sans font-medium">
          {SITE_CONFIG.institution.collegeName} ({SITE_CONFIG.institution.collegeAbbr}) is accredited by NAAC and NBA, and permanently affiliated with the University of Mumbai. For academic inquiries, students may consult the department course coordinator during scheduled office hours.
        </p>
        <div className="flex flex-wrap gap-3 pt-2 text-xs font-sans">
          <a
            href={SITE_CONFIG.links.mumbaiUniversitySyllabusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-ink-900 dark:text-white hover:border-brand-mid flex items-center gap-2 transition-all shadow-xs font-bold"
          >
            <FileText className="w-4 h-4 text-mod2" />
            <span>Mumbai University Syllabus Portal</span>
            <ExternalLink className="w-3 h-3 text-ink-500 dark:text-cream-muted" />
          </a>
          <a
            href={SITE_CONFIG.links.collegePortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-ink-900 dark:text-white hover:border-brand-mid flex items-center gap-2 transition-all shadow-xs font-bold"
          >
            <School className="w-4 h-4 text-mod3" />
            <span>SAKEC College Portal</span>
            <ExternalLink className="w-3 h-3 text-ink-500 dark:text-cream-muted" />
          </a>
        </div>
      </div>
    </div>
  );
};
