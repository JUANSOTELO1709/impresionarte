const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');
const flowers = [];

class Flower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 10 + 20; // Tamaño de la flor
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.1 - 0.05;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.angleSpeed;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Dibujar pétalos
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.ellipse(0, this.size / 2, this.size / 3, this.size, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(104, 13, 157, 0.5)';
            ctx.fill();
            ctx.rotate(Math.PI * 2 / 5);
        }

        // Dibujar el centro de la flor
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 5, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();

        ctx.restore();
    }
}

function createFlowers(numFlowers) {
    for (let i = 0; i < numFlowers; i++) {
        flowers.push(new Flower(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flowers.forEach(flower => {
        flower.update();
        flower.draw();
    });
    requestAnimationFrame(animate);
}

function showCard() {
    document.getElementById('message1').style.display = 'none';
    document.getElementById('message2').style.display = 'block';
    alert('Querida Anna, mi Venus, mi cielo, mi vida, Hay tantas formas en las que puedo llamarte, y aun así siento que ninguna hace justicia a lo que realmente representas para mí. Cada palabra que te dedico lleva un pedacito de mi corazón, porque eso eres: mi todo... Este año ha sido simplemente maravilloso, y no tengo dudas de que la razón principal eres tú. Desde que entraste en mi vida, cada día tiene un brillo especial, como si el sol saliera solo para iluminarnos. Tu sonrisa, tus palabras, tu voz, todo en ti me llena de una felicidad que nunca creí posible. Eres una fuerza en los días difíciles, mi calma cuando todo parece agitado, y mi alegría constante... Quiero que inicies el año pensando asi, teniendo claro esto, ¿sabias?, Contigo, cada tiempo es unico, desde las pequeñas charlas cotidianas hasta los instantes en los que el silencio dice más que mil palabras. Quiero que sepas cuánto valoro todo lo que haces, lo que conoces, y eres capaz de brindar conmigo, eres increible, Este año ha sido una aventura increíble, mi vida ha  tenido multiples cosas, pero lo que mas valoro es tu estadia en mi vida, enserio te quiero, y no puedo esperar a descubrir todo lo que el futuro nos tiene preparado. Porque contigo, Anna, sé que lo mejor está siempre por venir. Gracias por existir, ser mi amiga y pues... mi musa. Eres uno de los regalos mas hermosos que la vida me ha dado, y espero hacerte tan feliz como tú me haces a mi. Con todo mi corazón: juan <3');


}

function showFlowers() {
    document.getElementById('message2').style.display = 'none';
    canvas.style.display = 'block';
    createFlowers(50);
    animate();
}
