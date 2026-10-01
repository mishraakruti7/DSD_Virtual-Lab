import { supabase } from '../lib/supabaseClient';
import { ALL_THEORY_MODULES } from '../data/modules';

async function migrateModules() {
  console.log('Starting migration...');

  for (const moduleDef of ALL_THEORY_MODULES) {
    // 1. Insert Module
    const { data: moduleData, error: moduleError } = await supabase
      .from('modules')
      .insert([{
        title: moduleDef.title,
        description: moduleDef.description,
        order_number: moduleDef.id, // Using id as order for now
        content: {
          hours: moduleDef.hours,
          weightageMarks: moduleDef.weightageMarks,
          coTarget: moduleDef.coTarget,
          textbookRef: moduleDef.textbookRef
        }
      }])
      .select()
      .single();

    if (moduleError || !moduleData) {
      console.error('Error inserting module:', moduleError);
      continue;
    }

    console.log(`Inserted module: ${moduleDef.title}`);

    // 2. Insert Lessons (Sections)
    for (const section of moduleDef.sections) {
      const { error: lessonError } = await supabase
        .from('lessons')
        .insert([{
          module_id: moduleData.id,
          title: section.title,
          content: JSON.stringify({
            summary: section.summary,
            keyFormulasAndConcepts: section.keyFormulasAndConcepts,
            examTips: section.examTips
          }),
          order_number: parseInt(section.subtopicId.split('-')[0]) || 0
        }]);

      if (lessonError) console.error('Error inserting lesson:', lessonError);
    }

    console.log(`Inserted lessons for: ${moduleDef.title}`);
  }

  console.log('Migration completed.');
}

migrateModules();
