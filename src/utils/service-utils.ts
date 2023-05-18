export enum ServerType {
  LOCAL = 'LOCAL',
  DEV = 'DEV',
  PRODUCTION = 'PRODUCTION',
  STAGING = 'STAGING',
}

export const isCrossOrigin = (res: string) => {
  return res.search(/\.gif/) !== -1
}

export const getURLParameter = (key: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(key)
}

export const getServerType = () => {
  const { hostname } = window.location
  if (hostname.includes('local')) return ServerType.LOCAL
  if (hostname.includes('tinytap.it')) return ServerType.STAGING
  if (hostname.includes('tinytap.com')) return ServerType.PRODUCTION
  return ServerType.STAGING
}

export const getServerBase = () => {
  const serverType = getServerType()
  switch (serverType) {
    case ServerType.PRODUCTION:
      return 'https://www.tinytap.com'
    case ServerType.LOCAL:
      return 'http://local.tinytap.it'
    case ServerType.STAGING:
    default:
      return 'https://staging.tinytap.it'
  }
}

export const getStaticServerBase = () => {
  const serverType = getServerType()
  switch (serverType) {
    case ServerType.PRODUCTION:
      return 'https://static.tinytap.com'
    case ServerType.LOCAL:
    case ServerType.STAGING:
    default:
      return 'http://staging-static.tinytap.it'
  }
}

export const getStaticMediaPath = () => {
  return `${getStaticServerBase()}/media/`
}

export const getStaticSoundPath = () => {
  //https://static.tinytap.com/media/sounds/MediaResources/music/Morning-Zoo-CHJ014201.mp3
  return `${getStaticServerBase()}/media/sounds/`
}

export const getStructureFilePath = () => {
  //https://www.tinytap.com/store/api/album/structure/?unique_id=D5A4C79F-07BB-483E-BB6C-BCBB487FF580

  let structureUrl = `${getServerBase()}/store/api/album/structure/`
  const structureJson = getURLParameter('structureJson')
  const uniqueId = getURLParameter('id')
  const structureDir = getURLParameter('dir')

  if (uniqueId !== null) {
    structureUrl += `?unique_id=${uniqueId}`
  } else if (structureDir !== null) {
    structureUrl += `?directory=${structureDir}`
  } else if (structureJson !== null) {
    structureUrl = structureJson
  }

  return structureUrl
}

export const getGameId = () => {
  const structureJson = getURLParameter('structureJson')
  const uniqueId = getURLParameter('id')
  const structureDir = getURLParameter('dir')
  return uniqueId ? uniqueId : structureDir ? structureDir : structureJson ? structureJson : 'xxx'
}

