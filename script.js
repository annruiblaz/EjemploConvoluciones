//Creamos el obj imagen
let image = new Image();

//Una vez carga la img se ejecuta el metodo imageLoaded()
image.onload = imageLoaded;
image.src = "gato.jpg";

function imageLoaded() {
    //Obtenemos la referencia del canvas y el context
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    //Asignamos el tamaño al canvas q tiene la img
    canvas.width = image.width;
    canvas.height = image.height;

    //Dibujamos la img en el contexto pasandole los parametros necesarios
    ctx.drawImage(image, 0, 0, image.width, image.height);

    blackAndWhiteCanvas(canvas, ctx);

    var result = document.getElementById('resultado');
    convolucionar(canvas, result);
}

function blackAndWhiteCanvas(canvas, ctx) {
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log('image data: ', imgData);
    var pixels = imgData.data;

    /* 
    Debemos de tener en cuenta que sigue el patrón del RGBA
    - La posicion 0 será el canal rojo del 1º pixel
    - La posicion 1 será el canal verde del 1º pixel
    - La posicion 2 será el canal azul del 1º pixel
    - La posicion 3 será el canal alpha del 1º pixel
    */

    for(var p = 0; p < pixels.length; p += 4) {
        var red = pixels[p];
        var green = pixels[p + 1];
        var blue = pixels[p + 2];
        var alpha = pixels[p + 3];

        var grey = (red + green + blue) / 3;

        //Asignamos el nuevo color gris a los canales(RGB) del pixel
        pixels[p] = grey;
        pixels[p + 1] = grey;
        pixels[p + 2] = grey;
    }

    //Asignamos la img con los nuevos valores en cada pixel
    ctx.putImageData(imgData, 0, 0);
}

function convolucionar(originalCanvas, destinationCanvas) {
    var ctxOriginal = originalCanvas.getContext('2d');
    var imgDataOriginal = originalCanvas.ctxOriginal.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    var pixelsOriginal = originalCanvas.imageData();

    var ctxDestination = destinationCanvas.getContext('2d');
    var imgDataDestination = destinationCanvas.ctxDestination.getImageData(0, 0, destinationCanvas.width, destinationCanvas.height);
    var pixelsDestination = destinationCanvas.imageData();
    
    //Nucleo Kernel
    var kernel = [
        [-1, -1, -1],
        [-1 ,8, -1],
        [-1, -1, -1]
    ];
    
    //Nos asgeuramos que tienen el mismo tamaño
    const canvasWidth = originalCanvas.width;
    const canvasHeight = originalCanvas.height;
    
    //Itera cada pixel de la img / canvas 
    for (var y = 1; y < canvasHeight - 1; y ++) {
        for (var x = 1; x < canvasWidth -1; x++) {
            const index = (x + y * canvasWidth) * 4;
            let greyPixelValue = 0;

            //Bucle anidado para aplicar el kernel sobre los "vecinos" de cada pixel
            for( let i = -1; i <= 1; i++) {
                for( let j = -1; j <= 1; j++) {
                    const nearPixel = ((x + j) + (y + i) * canvasWidth) * 4;
                    const kernelValue = kernel[i +1][j + 1];

                    greyPixelValue += pixelsOriginal[nearPixel] * kernelValue;
                }
            }

            //Asignamos los nuevos valores al pixel de destino
            pixelsDestination[index] = greyPixelValue;
            pixelsDestination[index + 1] = greyPixelValue;
            pixelsDestination[index + 2] = greyPixelValue;
            pixelsDestination[index + 3] = 255;
        }
    }
    //Mostramos la img resultante en el canvas de resultado
    ctxDestination.putImageData(imgDataDestination, 0, 0);
}

