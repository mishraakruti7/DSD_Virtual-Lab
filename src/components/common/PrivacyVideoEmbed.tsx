import React, { useState } from 'react';
import { Play, ShieldCheck, ExternalLink } from 'lucide-react';

interface PrivacyVideoEmbedProps {
  videoId: string;
  title: string;
  channelTitle?: string;
}

export const PrivacyVideoEmbed: React.FC<PrivacyVideoEmbedProps> = ({ videoId, title, channelTitle }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#ded4c2] dark:border-slate-800 bg-slate-900 shadow-md">
      {isLoaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="w-full h-full border-0"
        />
      ) : (
        <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="max-w-md space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[10px] font-mono text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy Click-to-Load Embed</span>
            </div>

            <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2">
              {title}
            </h3>

            {channelTitle && (
              <p className="text-xs text-stone-400 font-mono">Source: {channelTitle}</p>
            )}

            <button
              onClick={() => setIsLoaded(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={`Load video: ${title}`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Click to Load Video</span>
            </button>

            <p className="text-[10px] text-stone-400 leading-relaxed">
              To protect your privacy, no data is sent to YouTube until you click. Loading will connect to{' '}
              <code className="text-cyan-300 font-mono">youtube-nocookie.com</code>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
