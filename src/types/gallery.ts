export type DiagramCategory =
  | 'Basic Gates & Universal'
  | 'Flip-Flops & Latches'
  | 'Counters & Registers'
  | 'Transistor Level (TTL & CMOS)'
  | 'FSM & State Flow'
  | 'Lab Experiments';

export interface GalleryDiagramItem {
  id: string;
  title: string;
  category: DiagramCategory;
  moduleRef: number;
  coRef: string;
  description: string;
  schematicType: string;
  tags: string[];
  academicNote: string;
  icCodes?: string[];
}
