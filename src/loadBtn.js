export { showBtn, hideBtn };

function hideBtn(item) {
  item.classList.add('visually-hidden');
}

function showBtn(item) {
  item.classList.remove('visually-hidden');
}
