const getCid = ({ el }) => {
  const itemUrl = el
    .querySelector('.tmb')
    .querySelector('a')
    .getAttribute('href');
  return itemUrl.match(/(?<=cid=)[\w-]+/g)[0];
};

export default getCid;
