export const getYoutubeVideoId = (url: string) => {
  const regExp =
    /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[?=&+%\w-]*/gi // eslint-disable-line
  const match = regExp.exec(url)

  return match ? match[1] : ''
}

export const getLocalVideo = (baseUrl: string, videoURL: string) => {
  const videoPath = baseUrl + 'video/' + videoURL.substr(8, videoURL.length - 8)
  return videoPath
}

