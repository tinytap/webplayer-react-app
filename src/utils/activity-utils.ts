export const youtubeParser = (url: string) => {
  const regExp =
    /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[?=&+%\w-]*/gi // eslint-disable-line
  const match = regExp.exec(url)

  return match ? match[1] : ''
}

