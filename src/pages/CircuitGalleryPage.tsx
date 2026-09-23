import React, { useState, useMemo, useEffect } from 'react';
import { GALLERY_DIAGRAMS } from '../data/gallery';
import { GalleryDiagramItem, DiagramCategory } from '../types/gallery';
import {
  TtlTotemPoleSchematic,
  CmosSwitchSchematic,
  MasterSlaveJkSchematic,
  SecurityDoorSchematic,
  SequenceDetectorFsmDiagram,
  VendingMachineAsmChart,
  Mod6RippleCounterSchematic,
  FullAdderSubtractorSchematic,
  Decoder74138Schematic,
  Mod8SyncCounterSchematic,
} from '../components/common/CircuitSchematics';
import { FileText, Search, Download, ZoomIn, Tag, Info, ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import { CircularLinkedList, Sorting } from '../dsa';

export const CircuitGalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDiagram, setActiveDiagram] = useState<GalleryDiagramItem>(GALLERY_DIAGRAMS[0]);

  const categories = [
    'All',
    'Transistor Level (TTL & CMOS)',
    'Flip-Flops & Latches',
    'Counters & Registers',
    'FSM & State Flow',
    'Lab Experiments',
  ];

  // --- DSA MODULE 4: QUICK SORT FOR GALLERY DIAGRAM ORDERING ---
  const sortedDiagrams = useMemo(() => {
    const filtered = GALLERY_DIAGRAMS.filter((d) => {
      const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });

    // In-place divide-and-conquer Quick Sort by moduleRef and title
    return Sorting.quickSort(filtered, (a, b) => {
      if (a.moduleRef !== b.moduleRef) return a.moduleRef - b.moduleRef;
      return a.title.localeCompare(b.title);
    });
  }, [selectedCategory, searchQuery]);

  // --- DSA MODULE 1: CIRCULAR LINKED LIST FOR SEAMLESS LIGHTBOX NAVIGATION ---
  const circularGallery = useMemo(() => {
    const sourceList = sortedDiagrams.length > 0 ? sortedDiagrams : GALLERY_DIAGRAMS;
    return CircularLinkedList.fromArray(sourceList);
  }, [sortedDiagrams]);

  useEffect(() => {
    circularGallery.setCurrent((d) => d.id === activeDiagram.id);
  }, [circularGallery, activeDiagram.id]);

  const handleNextDiagram = () => {
    const nextItem = circularGallery.next();
    if (nextItem) setActiveDiagram(nextItem);
  };

  const handlePrevDiagram = () => {
    const prevItem = circularGallery.prev();
    if (prevItem) setActiveDiagram(prevItem);
  };

  const renderSchematic = (type: string) => {
    switch (type) {
      case 'ttl_totem_pole':
        return <TtlTotemPoleSchematic activeRegion="Standard Saturated Switching" />;
      case 'cmos_inverter':
        return <CmosSwitchSchematic gateType="inverter" />;
      case 'cmos_nand':
        return <CmosSwitchSchematic gateType="nand" />;
      case 'cmos_nor':
        return <CmosSwitchSchematic gateType="nor" />;
      case 'master_slave_jk':
        return <MasterSlaveJkSchematic />;
      case 'mod6_counter':
        return <Mod6RippleCounterSchematic />;
      case 'mod8_sync_counter':
        return <Mod8SyncCounterSchematic />;
      case 'full_adder_subtractor':
        return <FullAdderSubtractorSchematic />;
      case 'decoder_74138':
        return <Decoder74138Schematic />;
      case 'exp11_security_door':
        return <SecurityDoorSchematic />;
      case 'exp12_fsm':
        return <SequenceDetectorFsmDiagram />;
      case 'vending_machine_asm':
        return <VendingMachineAsmChart />;
      default:
        return <TtlTotemPoleSchematic />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border border-t-4 border-t-purple-600 shadow-sm transition-colors">
        {/* Playful Ambient Blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-mod4/20 to-brand-mid/20 blur-3xl opacity-60 animate-blob-drift-1" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-mod3/20 to-mod1/20 blur-3xl opacity-50 animate-blob-drift-2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-vivid-mod4 uppercase tracking-wider flex items-center gap-1.5 font-sans font-bold">
              <FileText className="w-4 h-4 text-white" />
              Interactive SVG Circuit Schematics & Flowcharts
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-ink-900 dark:text-white">
            <span className="text-brand-gradient">DSD Circuit &</span> Architecture Gallery
          </h1>
          <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-cream-muted mt-2 max-w-2xl leading-relaxed font-medium">
            High-resolution, responsive vector diagrams including transistor-level TTL totem-pole gates, CMOS complementary networks, Master-Slave architectures, FSM transition graphs, and ASM flowcharts.
          </p>

          {/* Filter bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-mid absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search schematics, IC codes (e.g., 7400, totem-pole, FSM)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-xs font-sans text-ink-900 dark:text-white placeholder:text-ink-500 dark:placeholder:text-cream-muted focus:outline-none focus:border-brand-mid shadow-inner font-medium"
              />
            </div>

            <div className="flex flex-wrap gap-1 bg-cream-soft dark:bg-darklab-subtle p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold transition-all ${
                    selectedCategory === cat
                      ? 'btn-brand-gradient !text-white shadow-brand'
                      : 'text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card hover:text-ink-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Gallery Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Diagram List (Ordered via QuickSort) */}
        <div className="lg:col-span-4 space-y-3 max-h-[850px] overflow-y-auto pr-1">
          {sortedDiagrams.map((diag) => {
            const isSelected = activeDiagram.id === diag.id;
            return (
              <div
                key={diag.id}
                onClick={() => setActiveDiagram(diag)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all border-t-4 border-t-purple-600 ${
                  isSelected
                    ? 'bg-mod4-wash dark:bg-darklab-card border-mod4 text-ink-900 dark:text-white shadow-violet ring-2 ring-mod4 scale-[1.01]'
                    : 'bg-white dark:bg-darklab-card border-cream-border dark:border-darklab-border text-ink-900 dark:text-white hover:border-brand-mid shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="badge-vivid-mod4 text-[10px] font-sans font-bold">
                    Module {diag.moduleRef} • {diag.coRef}
                  </span>
                  {diag.icCodes && (
                    <span className="text-[10px] font-mono text-ink-600 dark:text-cream-muted font-bold">
                      {diag.icCodes.join(', ')}
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-sans font-bold mt-2 text-ink-900 dark:text-white line-clamp-2">
                  {diag.title}
                </h3>
                <p className="text-[11px] font-sans text-ink-600 dark:text-cream-muted line-clamp-2 mt-1 leading-relaxed font-medium">
                  {diag.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Interactive Schematic Display */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-3xl card-vivid-mod4 p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-border dark:border-darklab-border pb-4">
              <div>
                <span className="badge-vivid-mod4 uppercase tracking-wider font-sans font-bold">
                  {activeDiagram.category}
                </span>
                <h2 className="text-xl sm:text-3xl font-display font-black text-ink-900 dark:text-white mt-2">
                  {activeDiagram.title}
                </h2>
              </div>

              {/* Circular Linked List Prev / Next Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevDiagram}
                  className="p-2 rounded-xl bg-white dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-ink-800 dark:text-cream-paper hover:bg-cream-soft shadow-xs cursor-pointer active:scale-95 transition-all"
                  title="Previous Schematic (Circular Linked List)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextDiagram}
                  className="p-2 rounded-xl bg-white dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-ink-800 dark:text-cream-paper hover:bg-cream-soft shadow-xs cursor-pointer active:scale-95 transition-all"
                  title="Next Schematic (Circular Linked List)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded Responsive SVG */}
            <div className="overflow-hidden rounded-3xl border border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-subtle p-3 shadow-inner">
              {renderSchematic(activeDiagram.schematicType)}
            </div>

            {/* Academic Notes & Description */}
            <div className="space-y-3 font-sans">
              <div className="p-4 rounded-2xl bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-xs text-ink-800 dark:text-cream-paper leading-relaxed font-medium">
                <span className="font-bold text-brand-mid dark:text-purple-400 font-sans text-xs block mb-1 uppercase tracking-wider">
                  CIRCUIT DESCRIPTION:
                </span>
                {activeDiagram.description}
              </div>

              <div className="p-4 rounded-2xl bg-mod2-wash dark:bg-darklab-subtle border-2 border-mod2/40 text-xs text-ink-800 dark:text-cream-paper leading-relaxed font-medium">
                <span className="font-bold text-mod2-dark dark:text-mod2 font-sans text-xs block mb-1 uppercase tracking-wider">
                  ACADEMIC & EXAM NOTE:
                </span>
                {activeDiagram.academicNote}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 font-sans">
                <span className="text-xs text-ink-600 dark:text-cream-muted font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Tags:
                </span>
                {activeDiagram.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border text-brand-mid dark:text-purple-400 font-bold"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
