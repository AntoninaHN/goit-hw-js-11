// import axios from 'axios';
const axios = require('axios').default;
export { getImages, resetPage };

const BASE_URL = 'https://pixabay.com/api/';
const API = '24482250-ff2a48ff2cbe8defcdea0f664';
let page = 1;

async function getImages(requestValue) {
  try {
    const images = await axios.get(
      `${BASE_URL}?key=${API}&q=${requestValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`,
    );
    page += 1;
    return images;
  } catch (error) {
    console.log(error);
  }
}

function resetPage() {
  page = 1;
}
