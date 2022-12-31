/**
 * Author: Gurvir Singh
 * Email: gurvirbaraich@gmail.com
 */

class ImageHandler {
	/**
	 * @param {Image} #image
	 */
	#image = new Image();

	/**
	 * @param {EventEmitter} #emitter
	 */
	#emitter = new EventEmitter();

	/**
	 * @param {HTMLCanvasElement} #canvas
	 * @param {CanvasRenderingContext2D} #context
	 */
	#canvas = document.createElement("canvas");
	#context = this.#canvas.getContext("2d");

   options = {
      lens: {
         color: "rgba(0, 0, 0, 0.30)"
      }
   }

   get lens() {
      return {
         /**
          * @param {LensBase} lens
          */
         loadCustomLens: (lens) => {
            if (!(lens instanceof LensBase)) 
               return console.error("Lens must inherit properties from `LensBase`");
            
            this.emit("load-lens", { detail: lens });
         }
      }
   }

	/**
	 *
	 * @param {String} url
	 */
	constructor(url) {
		this.#image.src = url;
		this.#image.crossOrigin = "Anonymous";

		this.load();
	}

	/**
	 * Responsible for loading the image and displaying it
	 */
	load() {
		this.#image.onload = (e) => {
			this.#canvas.width = this.#image.width;
			this.#canvas.height = this.#image.height;

			this.#context.drawImage(
				this.#image,
				0,
				0,
				this.#image.width,
				this.#image.height
			);

			this.emit("load", e);

         this.emit("set-lens-dimensions", {
            width: this.#image.width,
            height: this.#image.height
         });
		};

      this.on("load-lens", ({ detail }) => this.#loadLens(detail));
	}

   /**
    * @param {LensBase} lens
    */
   #loadLens(lens) {
      const lensCanvas = document.createElement("canvas");

      this.on("set-lens-dimensions", () => {
         lensCanvas.width = this.#canvas.width;
         lensCanvas.height = this.#canvas.height;
      });

      lensCanvas.setAttribute("style", "pointer-events:none;");

      lens.container.appendChild(lensCanvas);
      this.#canvas.onmousemove = (e) => this.#mousemove(e, lens, lensCanvas, this.options);
   }

   /**
    * @param {MouseEvent} e
    * @param {HTMLCanvasElement} canvas
    */
   #mousemove(e, lens, canvas, options) {
      // Getting the context from lens canvas
      const lensContext = canvas.getContext("2d");

      // Clearing the canvas everytime the mouse moves
      lensContext.clearRect(0, 0, canvas.width, canvas.height);

      lens.config.loadOnto(this.#canvas.parentElement);
      lens.display(e, canvas, options);

      this.#updatePreview(
         lens,
         e.clientX - lens.width / 2,
         e.clientY - lens.height / 2,
         lens.width,
         lens.height
      );
   }

   #updatePreview(lens, x, y, width, height) {
      const imageData = this.#context.getImageData(x, y, width, height);
      const outputContext = lens.container.getContext('2d');

      lens.container.width = lens.width;
      lens.container.height = lens.height;

      outputContext.putImageData(imageData, 0, 0);
   }

	/**
	 *
	 * @param {HTMLElement | string} parent
	 */
	setParent(parent) {
		if (!(parent instanceof HTMLElement)) {
			parent = document.querySelector(parent);
		}

		parent.appendChild(this.#canvas);
	}

	/**
	 * Used for emitting events
	 */
	emit(event, props) {
		this.#emitter.emit(event, props);
	}

	/**
	 * Used for listening to events
	 */
	on(event, callback) {
		this.#emitter.on(event, callback);
	}
}

class EventEmitter {
   /**
    * ----------------------------------------------------------------
    * LIGHTING UP THE SKY
    * ----------------------------------------------------------------
    */
   #emittable = document.createElement("emittable");

   /**
    * Used for emitting custom events
    */
   emit(event, props) {
      this.#emittable.dispatchEvent(
         new CustomEvent(event, props)
      ); 
   }

   /**
    * Used for listening to custom events
    */
   on(event, callback) {
      this.#emittable.addEventListener(event, callback);
   }
}

class LensBase extends EventEmitter {
   #width = 0;
   #height = 0;

   /**
    * @param {HTMLElement} #container
    * @param {HTMLElement} #lensContainer
    */
   #container = undefined;
   #lensContainer = undefined;

   get width() {
      return this.#width;
   }

   get height() {
      return this.#height;
   }

   get container() {
      return this.#container;
   }

   get config() {
      return {
         /**
          * 
          * @param {HTMLElement | string} container 
          */
         outputOnto: (container) => {
            if (!(container instanceof HTMLElement)) {
               container = document.querySelector(container);
            }

            this.#container = container;
         },

         /**
          * 
          * @param {HTMLElement | string} container 
          */
         loadOnto: (container) => {
            if (!(container instanceof HTMLElement)) {
               container = document.querySelector(container);
            }

            this.#lensContainer = container;
         }
      }
   }

   /**
    * 
    * @param {number} width 
    * @param {number} height 
    */
   constructor(width, height) {
      super();

      this.#width = width;
      this.#height = height;
   }

   /**
    * 
    * @param {HTMLCanvasElement} canvas
    */
   display(e, canvas, options) {
      const context = canvas.getContext("2d");

      // Setting the color of the lens canvas
      context.fillStyle = options.lens.color;

      // Drawing rectangle on lens canvas
      context.fillRect(
         e.clientX - this.#width / 2,
         e.clientY - this.#height / 2,
         this.#width,
         this.#height
      );

      this.#lensContainer.appendChild(canvas);
   }
}

class Lens extends LensBase {
   constructor(width, height) {
      super(width, height);
   }
}

/**
 * @namespace PictureJS
 */
export default {
   Lens: Lens,
   LensBase: LensBase,
   Image: ImageHandler
}