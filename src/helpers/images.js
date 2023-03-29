export const trimImage = (url, width = 200, height = 260) => {
  if (url !== undefined && url !== null && url.includes('cloudinary')) {
    return url.replace(
      '/upload',
      `/upload/c_pad,q_auto,f_auto,dpr_1,w_${width},h_${height}`
    )
  } else if (url === undefined || url === null) {
    return ''
  } else {
    return url
  }
}
