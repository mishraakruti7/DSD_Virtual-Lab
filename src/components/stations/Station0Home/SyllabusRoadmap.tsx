import React from 'react';
import { COURSE_INFO, COURSE_OUTCOMES } from '../../../data/syllabusData';
import { StationTab } from '../../common/Header';
import {
  BookOpen,
  FlaskConical,
  Layers,
  Activity,
  Award,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Clock,
  Compass
} from 'lucide-react';

interface SyllabusRoadmapProps {
  onNavigate: (station: StationTab) => void;
}

export const SyllabusRoadmap: React.FC<SyllabusRoadmapProps> = ({ onNavigate }) => {
  const stationCards = [
    {
      id: 'theory' as StationTab,
      title: 'Station 1: DSD Theory Modules',
      hours: '30 Lecture Hours',
      desc: 'Deep-dive interactive modules: Sequential FFs, MSI ICs (7490-74194), TTL/CMOS parameters, Implication Tables, and Verilog RTL.',
      icon: BookOpen,
      badge: '4 Modules',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      actionText: 'Explore Theory',
    },
    {
      id: 'lab' as StationTab,
      title: 'Station 2: 12 Lab Experiments Manual',
      hours: '30 Practical Hours',
      desc: 'Complete university lab manual with apparatus, schematics, step-by-step procedures, live simulations, and real-time security door alarm.',
      icon: FlaskConical,
      badge: '12 Practicals + Mini-Proj',
      badgeColor: 'bg-peach-100 text-peach-800 border-peach-300',
      actionText: 'Open Lab Manual',
    },
    {
      id: 'breadboard' as StationTab,
      title: 'Station 3: Virtual Breadboard',
      hours: 'Hands-On Workbench',
      desc: 'Realistic solderless breadboard with power rails, DIP-14 IC sockets, switches, LEDs, and catenary gravitational curved jumper wires.',
      icon: Layers,
      badge: 'Interactive Hardware',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      actionText: 'Launch Breadboard',
    },
    {
      id: 'analyzer' as StationTab,
      title: 'Station 4: 4-Channel Logic Analyzer',
      hours: 'Timing & Waveforms',
      desc: 'Multi-channel digital waveform oscilloscope tracking Clock (CLK), Inputs (A, B), and Output (Y) with timebase zoom & transition counters.',
      icon: Activity,
      badge: 'Digital Oscilloscope',
      badgeColor: 'bg-sage-100 text-sage-800 border-sage-300',
      actionText: 'Open Scope',
    },
    {
      id: 'assessment' as StationTab,
      title: 'Station 5: Practice & Syllabus Quiz',
      hours: 'Continuous Evaluation',
      desc: '7 interactive troubleshooting challenge benches plus a 20-point comprehensive exam mapped to Bloom’s Taxonomy levels BL1 to BL4.',
      icon: Award,
      badge: '7 Benches + 20 MCQs',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      actionText: 'Take Assessment',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Station Pathways Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-sky-600" />
          <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
            Curriculum Stations
          </span>
        </div>
        <h3 className="font-heading font-bold text-2xl sm:text-3xl text-stone-900">
          Virtual Lab Learning Pathways
        </h3>
        <p className="text-stone-600 text-sm mt-1 max-w-2xl">
          Progress sequentially through the curriculum stations or jump directly into any experiment or interactive workbench.
        </p>
      </div>

      {/* Pathway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stationCards.map((station) => {
          const Icon = station.icon;
          return (
            <div
              key={station.id}
              onClick={() => onNavigate(station.id)}
              className="bg-[#fbf7ee] rounded-3xl p-6 border border-border-warm shadow-soft-sm hover:shadow-soft-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-canvas-cream border border-border-warm flex items-center justify-center text-stone-800 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-sky-600" />
                  </div>
                  <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${station.badgeColor}`}>
                    {station.badge}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-lg text-stone-900 mb-1 group-hover:text-sky-700 transition-colors">
                  {station.title}
                </h4>
                <div className="text-xs font-mono text-stone-500 mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{station.hours}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {station.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-warm flex items-center justify-between text-xs font-semibold text-sky-700 group-hover:text-sky-800">
                <span>{station.actionText}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Outcome (CO) Specification & Bloom's Taxonomy Matrix */}
      <div className="bg-canvas-cream rounded-3xl p-6 sm:p-8 border border-border-warm shadow-soft-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-border-warm">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-mono font-bold text-stone-600 uppercase tracking-wide">
                University Syllabus Articulation
              </span>
            </div>
            <h4 className="font-heading font-bold text-xl text-stone-900 mt-1">
              Course Outcomes & Cognitive Levels (Bloom’s Taxonomy)
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Course Code: {COURSE_INFO.courseCode} • {COURSE_INFO.institution} ({COURSE_INFO.affiliation})
            </p>
          </div>

          {/* Bloom distribution summary pill */}
          <div className="flex flex-wrap gap-2">
            {COURSE_INFO.bloomDistribution.map((item, i) => (
              <span key={i} className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${item.color}`}>
                {item.level}: {item.percentage}%
              </span>
            ))}
          </div>
        </div>

        {/* CO Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COURSE_OUTCOMES.map((co) => (
            <div
              key={co.code}
              className="bg-[#fbf7ee] rounded-2xl p-4 border border-border-warm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                    {co.code}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    {co.bloomLevel} • {co.hours} Hours
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-snug mb-3">
                  {co.statement}
                </p>
              </div>
              <div className="pt-2 border-t border-border-warm text-[10px] font-mono text-stone-500">
                Practicals mapped: Exps {co.labExperiments.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
