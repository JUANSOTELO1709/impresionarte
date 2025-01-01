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
    alert('Aquí está tu carta especial: Querida Anna, venus, mi cielo, vida, bueno, tantas cosas y formas en las que te puedo mencionar   este año ha sido increíble gracias a ti...');
}

function showFlowers() {
    document.getElementById('message2').style.display = 'none';
    canvas.style.display = 'block';
    createFlowers(50);
    animate();
}
