// EmailJS initialization
(function() {
    emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID
})();

document.getElementById('rentalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Pobierz wartości z formularza
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const dailyRate = parseFloat(document.getElementById('dailyRate').value);

    // Sprawdź, czy daty są poprawne
    if (startDate > endDate) {
        alert('Data początkowa nie może być późniejsza niż data końcowa.');
        return;
    }

    // Sprawdź dostępność terminów
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    for (let reservation of reservations) {
        const resStartDate = new Date(reservation.startDate);
        const resEndDate = new Date(reservation.endDate);
        if ((startDate <= resEndDate && endDate >= resStartDate)) {
            alert('Wybrane terminy są już zajęte.');
            return;
        }
    }

    // Oblicz liczbę dni wynajmu
    const timeDiff = endDate - startDate;
    const daysRented = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    // Oblicz całkowity koszt
    const totalCost = daysRented * dailyRate;

    // Zapisz rezerwację
    reservations.push({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // Wyślij powiadomienie e-mail
    const templateParams = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        totalCost: totalCost.toFixed(2)
    };
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
            console.log('FAILED...', error);
        });

    // Wyświetl wynik
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Całkowity koszt wynajmu: ${totalCost.toFixed(2)} PLN za ${daysRented} dni.`;
});
