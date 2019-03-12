export function cloneObject (obj) {
  let clone = {}

  for (var i in obj) {
    if (obj[i] != null && typeof (obj[i]) === 'object') {
      clone[i] = cloneObject(obj[i])
    } else {
      clone[i] = obj[i]
    }
  }

  return clone
}

export function strComparer (a, b) {
  if (a < b) { 
    return -1 
  }

  if (a > b) { 
    return 1 
  }

  return 0
}

export function strEqual (s1, s2, ignoreCase = false, useLocale = true) {
  if (!ignoreCase) {
    if (s1.length !== s2.length) {
      return false
    }

    return s1 === s2
  }

  if (useLocale) {
    if (useLocale.length) {
      return s1.toLocaleLowerCase(useLocale) === s2.toLocaleLowerCase(useLocale)
    } else {
      return s1.toLocaleLowerCase() === s2.toLocaleLowerCase()
    }
  } else {
    if (s1.length !== s2.length) {
      return false
    }

    return s1.toLowerCase() === s2.toLowerCase()
  }
}
