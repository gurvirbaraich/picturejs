import PictureJS from './main.js';

const lens = new PictureJS.Lens(
   (window.innerWidth / 2) * 0.25,
   (window.innerWidth / 2) * 0.25,
)

lens.lens.loadOnto(document.querySelector('.preview'));

const image = new PictureJS.Image(`https://picsum.photos/${window.innerWidth/2}/${window.innerHeight}`);  
image.setParent('.container');

image.on('load', () => {})

image.lens.loadCustomLens(lens);