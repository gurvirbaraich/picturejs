// Importing PictureJS from the module
import PictureJS from './main.js';

// Creating a lens
const lens = new PictureJS.Lens(
   (window.innerWidth / 2) * 0.25, // Width
   (window.innerWidth / 2) * 0.25, // Height
);

// Editing the config of the lens, and changing the output element
lens.config.outputOnto(
   document.querySelector('.preview') // The output element
);

// Creating a zoomable image
const image = new PictureJS.Image(
   `https://picsum.photos/${window.innerWidth/2}/${window.innerHeight}` // Url
);  

// Setting the parent element of @image
image.setParent('.container');


// Events avaliable
// : 'load'

// .on function to listen for load events
image.on(
   'load', // Event name
   () => console.log("Image Loaded...") // Callback
);

// Loading the lens
image.lens.loadCustomLens(lens);