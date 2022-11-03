import { argv0 } from 'process'

export const isNaturalNumber = (n: number | string): boolean => {
  n = n.toString()
  const n1 = Math.abs(Number(n))
  const n2 = parseInt(n, 10)
  return !isNaN(n1) && n2 === n1 && n1.toString() === n
}

export const isEmailAddress = (value: string): boolean => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value
  )
}

export const isBtcAddress = (value: string): boolean => {
  return true
  // return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(value)
}

export const isWeChat = (): boolean => {
  const ua = window.navigator.userAgent.toLowerCase()
  return ua.indexOf('micromessenger') !== -1
}
