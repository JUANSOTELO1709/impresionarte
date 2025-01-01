function countdown() {
    const countdownElement = document.getElementById('countdown');
    const showCardButton = document.getElementById('showCardButton');
    const targetDate = new Date('January 1, 2025 00:00:00').getTime();

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(interval);
            countdownElement.innerHTML = '¡Feliz Año Nuevo!';
            showCardButton.disabled = false;
        }
    }, 1000);
}

countdown();
