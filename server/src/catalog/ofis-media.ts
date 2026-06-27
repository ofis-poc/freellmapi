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

  // =========================
  // GOOGLE TTS
  // =========================

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
    "platform": "siliconflow",
    "model_id": "IndexTTS-2",
    "display_name": "IndexTTS-2",
    "modality": "audio",
    "priority": 1,
    "enabled": 1,
    "quota_label": "API Key"
  },
  {
    "platform": "siliconflow",
    "model_id": "Fish-Speech-1.5",
    "display_name": "Fish Speech 1.5",
    "modality": "audio",
    "priority": 2,
    "enabled": 1,
    "quota_label": "API Key"
  },
  {
    "platform": "siliconflow",
    "model_id": "FunAudioLLM/CosyVoice2-0.5B",
    "display_name": "CosyVoice 2",
    "modality": "audio",
    "priority": 3,
    "enabled": 1,
    "quota_label": "API Key"
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

  // =========================
  // GOOGLE STT
  // =========================

  {
    platform: 'google',
    model_id: 'gemini-2.5-flash',
    display_name: 'Gemini Speech To Text',
    modality: 'transcription',
    priority: 1,
    enabled: 1,
    quota_label: 'Keyless',
  },

  // =========================
  // GROQ STT
  // =========================

  {
    platform: 'groq',
    model_id: 'whisper-large-v3',
    display_name: 'Groq Whisper Large V3',
    modality: 'transcription',
    priority: 2,
    enabled: 1,
    quota_label: 'API Key',
  },

  {
    platform: 'groq',
    model_id: 'whisper-large-v3-turbo',
    display_name: 'Groq Whisper Turbo',
    modality: 'transcription',
    priority: 3,
    enabled: 1,
    quota_label: 'API Key',
  },

  // =========================
  // CLOUDFLARE
  // =========================

  {
    platform: 'cloudflare',
    model_id: '@cf/openai/whisper',
    display_name: 'Cloudflare Whisper',
    modality: 'transcription',
    priority: 4,
    enabled: 1,
    quota_label: 'API Key',
  },

  {
    platform: 'cloudflare',
    model_id: '@cf/myshell-ai/melotts',
    display_name: 'Cloudflare MeloTTS',
    modality: 'audio',
    priority: 4,
    enabled: 1,
    quota_label: 'API Key',
  },

  // =========================
  // NVIDIA
  // =========================

  {
    platform: 'nvidia',
    model_id: 'parakeet-ctc-1.1b',
    display_name: 'NVIDIA Parakeet STT',
    modality: 'transcription',
    priority: 5,
    enabled: 1,
    quota_label: 'API Key',
  },

  // =========================
  // OPENAI COMPAT
  // =========================

  {
    platform: 'openai',
    model_id: 'whisper-1',
    display_name: 'OpenAI Whisper',
    modality: 'transcription',
    priority: 6,
    enabled: 1,
    quota_label: 'API Key',
  },

  {
    platform: 'openai',
    model_id: 'tts-1',
    display_name: 'OpenAI TTS-1',
    modality: 'audio',
    priority: 5,
    enabled: 1,
    quota_label: 'API Key',
  },

  {
    platform: 'openai',
    model_id: 'tts-1-hd',
    display_name: 'OpenAI TTS-1 HD',
    modality: 'audio',
    priority: 6,
    enabled: 1,
    quota_label: 'API Key',
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

