import React, { useEffect } from 'react';
import { LegalDocumentMetadata } from '../../data/legalDocuments';
import { ShieldCheck, Calendar, FileText, ArrowLeft, Info, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LegalDocumentLayoutProps {
  doc: LegalDocumentMetadata;
}

export const LegalDocumentLayout: React.FC<LegalDocumentLayoutProps> = ({ doc }) => {
  useEffect(() => {
    document.title = `${doc.title} | Virtual DSD Lab`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [doc]);

  return (
    <article className="max-w-4xl mx-auto py-8 px-4 sm:px-6 font-sans">
      {/* Breadcrumb / Back Link */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline focus-visible:ring-2 focus-visible:ring-cyan-500 rounded p-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Virtual Lab Home</span>
        </Link>
      </nav>

      {/* Header Banner */}
      <header className="rounded-3xl border border-[#ded4c2] dark:border-slate-800 bg-white/80 dark:bg-[#121622]/90 backdrop-blur-xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Institutional Legal Policy • Version {doc.version}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          {doc.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-stone-300 leading-relaxed mb-6">
          {doc.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-stone-400 pt-4 border-t border-[#ded4c2] dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Effective: {doc.effectiveDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Reading Level: {doc.targetReadingLevel}</span>
          </div>
          <div>Last Updated: {doc.lastUpdated}</div>
        </div>
      </header>

      {/* Document Sections */}
      <div className="space-y-8">
        {doc.sections.map((section, idx) => (
          <section
            key={idx}
            className="rounded-2xl border border-[#e8dfcf] dark:border-slate-800/80 bg-white/70 dark:bg-[#121622]/60 p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              {section.heading}
            </h2>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-stone-300 leading-relaxed">
              {section.content.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>

            {section.callout && (
              <div
                className={`mt-4 p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                  section.callout.type === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200'
                }`}
              >
                {section.callout.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-600 dark:text-cyan-400" />
                )}
                <span>{section.callout.text}</span>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Footer Links to Other Policies */}
      <footer className="mt-12 pt-6 border-t border-[#ded4c2] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-600 dark:text-stone-400">
        <div className="flex flex-wrap gap-4">
          <Link to="/privacy" className="hover:text-cyan-600 dark:hover:text-cyan-400 underline">Privacy Notice</Link>
          <Link to="/terms" className="hover:text-cyan-600 dark:hover:text-cyan-400 underline">Terms of Use</Link>
          <Link to="/cookies" className="hover:text-cyan-600 dark:hover:text-cyan-400 underline">Cookie Policy</Link>
          <Link to="/accessibility" className="hover:text-cyan-600 dark:hover:text-cyan-400 underline">Accessibility Statement</Link>
          <Link to="/contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 underline">Grievance & Contact</Link>
        </div>
        <div>
          <span>Questions? Contact </span>
          <Link to="/contact" className="text-cyan-700 dark:text-cyan-400 font-bold hover:underline">
            Grievance Officer
          </Link>
        </div>
      </footer>
    </article>
  );
};
