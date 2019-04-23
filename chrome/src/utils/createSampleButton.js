const createSampleButton = () => {
  const $sampleButton = document.createElement('p');
  $sampleButton.setAttribute('class', 'sample');
  $sampleButton.innerHTML =
    '<a href><span class="btn-sample"><span></span></span></a>';
  return $sampleButton;
};

export default createSampleButton;
