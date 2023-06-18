import { useLayoutEffect, useRef, useState } from 'react'

export function useImage(url: string, crossOrigin?: string, referrerpolicy?: string) {
  // lets use refs for image and status
  // so we can update them during render
  // to have instant update in status/image when new data comes in
  const statusRef = useRef('loading')
  const imageRef = useRef() as any
  const [_url, setUrl] = useState(url)

  // we are not going to use token
  // but we need to just to trigger state update
  const [_, setStateToken] = useState(0) // eslint-disable-line

  useLayoutEffect(
    function () {
      statusRef.current = 'loading'
      imageRef.current = undefined

      if (!_url) return
      var img = document.createElement('img')

      function onload() {
        statusRef.current = 'loaded'
        imageRef.current = img
        setStateToken(Math.random())
      }

      function onerror() {
        statusRef.current = 'failed'
        imageRef.current = undefined
        setStateToken(Math.random())
      }

      img.addEventListener('load', onload)
      img.addEventListener('error', onerror)
      crossOrigin && (img.crossOrigin = crossOrigin)
      referrerpolicy && (img.referrerPolicy = referrerpolicy)
      img.src = _url

      return function cleanup() {
        img.removeEventListener('load', onload)
        img.removeEventListener('error', onerror)
      }
    },
    [_url, crossOrigin, referrerpolicy],
  )

  // return array because it is better to use in case of several useImage hooks
  // const [background, backgroundStatus] = useImage(url1);
  // const [patter] = useImage(url2);
  return [imageRef.current, statusRef.current, setUrl]
}

