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

