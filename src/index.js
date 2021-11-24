import './sass/main.scss';
import { getImages, resetPage } from './api';
import { showBtn, hideBtn } from './loadBtn';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { parseWithoutProcessing } from 'handlebars';
//import renderGallery from './render-gallery';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-btn'),
};

let element = '';
hideBtn(refs.loadBtn);

refs.form.addEventListener('submit', onSearch);
refs.loadBtn.addEventListener('click', onLoad);

function onSearch(event) {
  event.preventDefault();

  element = event.currentTarget.searchQuery.value;
  resetPage();
  hideBtn(refs.loadBtn);
  getImages(element).then(images => {
    const imagesArr = images.data.hits;
    const totalImages = images.data.totalHits;

    if (imagesArr.length === 0) {
      clearGallery();
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again 😱',
      );
    } else {
      clearGallery();
      renderGallery(imagesArr);
      new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
      Notiflix.Notify.success(`Hooray🎉 We found ${totalImages} images.`);
      showBtn(refs.loadBtn);
    }
  });
}

function renderGallery(images) {
  const markup = images
    .map(image => {
      return `
          <a class="gallery-item" href="${image.largeImageURL}">
        <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
        <p class="info-item">
        <b>Likes</b>
        ${image.likes}
        </p>
        <p class="info-item">
        <b>Views</b>
        ${image.views}
        </p>
        <p class="info-item">
        <b>Comments</b>
        ${image.comments}
        </p>
        <p class="info-item">
        <b>Downloads</b>
        ${image.downloads}
        </p>
        </div>
        </div>
          </a>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function onLoad() {
  getImages(element)
    .then(images => {
      const imagesArr = images.data.hits;

      if (imagesArr.length === 0) {
        Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
        hideBtn(refs.loadBtn);
        return;
      }

      renderGallery(imagesArr);
      new SimpleLightbox('.gallery a', { captionDelay: 250, showCounter: false });
    })

    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
      hideBtn(refs.loadBtn);
    });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
