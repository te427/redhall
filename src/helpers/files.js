import * as t from 'managers/data/constants/types'
import { BASE_PATH } from 'managers/data/constants/paths'

export const json = (f) => `${f}.${t.TYPE_JSON}`
export const yaml = (f) => `${f}.${t.TYPE_YAML}`
export const png = (f) => `${f}.${t.TYPE_PNG}`
export const mp3 = (f) => `${f}.${t.TYPE_MP3}`
export const wav = (f) => `${f}.${t.TYPE_WAV}`
export const fnt = (f) => `${f}.${t.TYPE_FNT}`

export const path = (p, f) => `${p}${f}`
export const fullPath = (p) => `${BASE_PATH}${p}`
export const loadPath = (p, f) => `../${p}` + (f ? f : '')
