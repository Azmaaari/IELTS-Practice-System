import Dexie, { type EntityTable } from 'dexie'
import type { SessionRecord } from '@/types/history'

export class IELTSDatabase extends Dexie {
  sessions!: EntityTable<SessionRecord, 'id'>
  
  constructor() {
    super('IELTSPracticeDB')
    
    this.version(1).stores({
      sessions: 'id, timestamp, type, examId, score'
    })
  }
}

export const db = new IELTSDatabase()

