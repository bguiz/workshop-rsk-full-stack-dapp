function elShow(el) {
  el.classList.toggle('hide', false);
}

function elHide(el) {
  el.classList.toggle('hide', true);
}

module.exports = {
  elShow,
  elHide,
};