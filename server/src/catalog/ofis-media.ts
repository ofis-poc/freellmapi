import type DatabaseType from 'better-sqlite3';

export interface OfisMediaModel {
  platform: string;
  model_id: string;
  display_name: string;
  modality: 'audio' | 'image' | 'transcription' | string;
  priority: number;
  enabled: number;
  quota_label: string;
}

export const OFIS_MEDIA_CATALOG: OfisMediaModel[] = [
  {
    platform: 'google',
    model_id: 'gemini-2.5-flash-preview-tts',
    display_name: 'Gemini 2.5 Flash TTS',
    modality: 'audio',
    priority: 1,
    enabled: 1,
    quota_label: 'Keyless',
  },
  {
    platform: 'google',
    model_id: 'gemini-2.5-pro-preview-tts',
    display_name: 'Gemini 2.5 Pro TTS',
    modality: 'audio',
    priority: 2,
    enabled: 1,
    quota_label: 'Keyless',
  },
  {
    platform: 'google',
    model_id: 'gemini-2.5-flash-preview-native-audio-dialog',
    display_name: 'Gemini Native Audio',
    modality: 'audio',
    priority: 3,
    enabled: 1,
    quota_label: 'Keyless',
  },
  {
    platform: 'google',
    model_id: 'gemini-live-2.5-flash-preview',
    display_name: 'Gemini Live Audio',
    modality: 'audio',
    priority: 4,
    enabled: 1,
    quota_label: 'Keyless',
  },
];

export function ensureOfisMediaCatalog(db: DatabaseType.Database): void {
  let totalChanges = 0;


  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO media_models (platform, model_id, display_name, modality, priority, enabled, quota_label)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const runInsert = db.transaction(() => {
    for (const m of OFIS_MEDIA_CATALOG) {
      const result = insertStmt.run(
        m.platform,
        m.model_id,
        m.display_name,
        m.modality,
        m.priority,
        m.enabled,
        m.quota_label
      );
      totalChanges += result.changes;
    }
  });

  runInsert();

  if (totalChanges > 0) {
    console.log(`[ofis-media] applied ${totalChanges} custom media models`);
  } else {
    console.log(`[ofis-media] catalog already up to date`);
  }
}

