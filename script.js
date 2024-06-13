<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBOdr5bDRwsZCXOjlX_TVXFNEnVA0w812Q",
    authDomain: "esnieru.firebaseapp.com",
    databaseURL: "https://esnieru-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "esnieru",
    storageBucket: "esnieru.appspot.com",
    messagingSenderId: "523836156102",
    appId: "1:523836156102:web:5dc41e61790291edfa8fc7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Pobierz ceny nieruchomości z Firebase
function loadProperties() {
    const propertySelect = document.getElementById('propertySelect');
    database.ref('properties').once('value', function(snapshot) {
        const properties = snapshot.val() || {};
        for (let key in properties) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = properties[key].name + ' - ' + properties[key].dailyRate + ' PLN/dzień';
            propertySelect.appendChild(option);
        }
    });
}

// Wywołaj funkcję ładowania nieruchomości po załadowaniu strony
window.onload = loadProperties;

document.getElementById('rentalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Pobierz wartości z formularza
    const propertySelect = document.getElementById('propertySelect');
    const propertyKey = propertySelect.value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    // Sprawdź, czy daty są poprawne
    if (startDate > endDate) {
        alert('Data początkowa nie może być późniejsza niż data końcowa.');
        return;
    }

    // Pobierz dane nieruchomości z Firebase
    database.ref('properties/' + propertyKey).once('value', function(snapshot) {
        const property = snapshot.val();
        const dailyRate = property.dailyRate;

        // Sprawdź dostępność terminów
        database.ref('reservations').once('value', function(snapshot) {
            let reservations = snapshot.val() || [];
            for (let key in reservations) {
                const reservation = reservations[key];
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

            // Zapisz rezerwację w Firebase
            const newReservation = database.ref('reservations').push();
            newReservation.set({
                propertyKey: propertyKey,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                totalCost: totalCost
            });

            // Wyświetl wynik
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `Całkowity koszt wynajmu: ${totalCost.toFixed(2)} PLN za ${daysRented} dni.`;
        });
    });
});
