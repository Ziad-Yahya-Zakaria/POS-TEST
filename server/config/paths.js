import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('../../', import.meta.url))

export const attachmentsDirectoryName = process.env.ATTACHMENTS_DIR?.trim() || 'المرفقات'
export const attachmentsDirectory = resolve(projectRoot, attachmentsDirectoryName)

export function ensureStorageDirectories() {
  mkdirSync(attachmentsDirectory, { recursive: true })
}
