
export function encode<T>(obj: T, encode: Encode): T {
  const newObjb = { ...obj }

  for (const key in encode) {
    const fn = encode[key]
    const value = typeof fn === 'function' ? fn(obj) : obj[fn]
    newObjb[key] = value
  }


  return { ...newObjb }
}

export function encodeData<T>(data: T[], encoders: Encode): T[] {
  return data.map((dato) => encode(dato, encoders))
}