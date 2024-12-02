const  apiConfig = {
    baseUrl: 'https;//api.themoviedb.org/3/',
    apiKey: '013044f24bc916f73380c8a21b491d6b',
    originalImage: (imgPath) =>  `https://image.tmdb.org/t/p/original/${imgPath}`,
    w500Image: (imgPath) =>  `https://image.tmdb.org/t/p/w500/${imgPath}`,
}
export default apiConfig;