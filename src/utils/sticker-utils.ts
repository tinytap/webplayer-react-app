// from https://github.com/Fionoble/transformation-matrix-js/blob/fc38603c6ae43e1fde72e14bb8e22420c574eea3/src/matrix.js#L438
export function decompose(me: any) {
  var a = me.a,
    b = me.b,
    c = me.c,
    d = me.d,
    acos = Math.acos,
    atan = Math.atan,
    sqrt = Math.sqrt,
    pi = Math.PI,
    translate = { x: me.e, y: me.f },
    rotation = 0,
    scale = { x: 1, y: 1 },
    skew = { x: 0, y: 0 },
    determ = a * d - b * c // determinant(), skip DRY here...

  if (a || b) {
    var r = sqrt(a * a + b * b)
    rotation = b > 0 ? acos(a / r) : -acos(a / r)
    scale = { x: r, y: determ / r }
    skew.x = atan((a * c + b * d) / (r * r))
  } else if (c || d) {
    var s = sqrt(c * c + d * d)
    rotation = pi * 0.5 - (d > 0 ? acos(-c / s) : -acos(c / s))
    scale = { x: determ / s, y: s }
    skew.y = atan((a * c + b * d) / (s * s))
  } else {
    // a = b = c = d = 0
    scale = { x: 0, y: 0 } // = invalid matrix
  }

  return {
    scale: scale,
    position: translate,
    rotation: rotation,
    skew: skew,
  }
}

// parse transformation string into matrix object
export function parseTransform(string: string) {
  var parts = string.split(',')
  return {
    a: parseFloat(parts[0]),
    b: parseFloat(parts[1]),
    c: parseFloat(parts[2]),
    d: parseFloat(parts[3]),
    e: parseFloat(parts[4]),
    f: parseFloat(parts[5]),
  }
}

export function decomposeMatrix(transform: string) {
  const matrix = parseTransform(transform)
  const attrs = decompose(matrix)
  return attrs
}

export const slideHaveInteractiveLayer = (layers: any[], ignoreInteractiveLoopTypeIndex: number | undefined = undefined) => {
  return (layers || []).some((l) => isLayerInteractive(l, ignoreInteractiveLoopTypeIndex))
}

const isLayerInteractive = (layer: any, ignoreInteractiveLoopTypeIndex: number | undefined) => {
  return [
    layer.InteractiveLoopType,
    layer.InteractiveShowType,
    layer.interactiveToggleShow,
    layer.interactiveLayerSound,
  ].some(function (interativity) {
    return Boolean(interativity) && Boolean(interativity !== ignoreInteractiveLoopTypeIndex)
  })
}