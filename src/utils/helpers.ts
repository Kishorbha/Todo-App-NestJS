import * as bcrypt from 'bcrypt'
import { generate } from 'otp-generator'
import * as crypto from 'crypto'
import { createCipheriv, createDecipheriv } from 'crypto'
const algorithm = 'aes-256-cbc'

export async function hashPassword(rawPassword: string) {
  return bcrypt.hash(rawPassword, Number(process.env.PASSWORD_SALT))
}

export async function compareHash(rawPassword: string, hashedPassword: string) {
  return bcrypt.compare(rawPassword, hashedPassword)
}

export function generateOtp() {
  const otp = generate(5, {
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  })
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex')

  return { otp, hashedOtp }
}

export function generateTemporaryToken() {
  const unHashedToken = crypto.randomBytes(20).toString('hex')
  const hashedToken = crypto
    .createHash('sha256')
    .update(unHashedToken)
    .digest('hex')

  return { unHashedToken, hashedToken }
}

export function encryptText(text: string) {
  const cipher = createCipheriv(
    algorithm,
    process.env.ENCRYPTION_KEY32,
    process.env.ENCRYPTION_KEY16,
  )
  let encryptedData = cipher.update(text, 'utf-8', 'hex')
  encryptedData += cipher.final('hex')
  return encryptedData
}

export function decryptText(encryptedText: string) {
  const decipher = createDecipheriv(
    algorithm,
    process.env.ENCRYPTION_KEY32,
    process.env.ENCRYPTION_KEY16,
  )
  let decryptedData = decipher.update(encryptedText, 'hex', 'utf-8')
  decryptedData += decipher.final('utf8')
  return decryptedData
}

// Utility function to split an array into chunks
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

// Helper to generate conversation name
export function generateConversationName(question: string) {
  const words = question.split(/\s+/) // Split by whitespace to handle multiple spaces
  return words.slice(0, 3).join(' ')
}
