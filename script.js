// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set, push, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase configuration
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
const database = getDatabase(app);

// Pobierz ceny nieruchomości z Firebase
async function loadProperties() {
    const propertySelect = document.getElementById('propertySelect');
    const propertiesRef = ref(database, 'properties');
    try {
        const snapshot = await get(propertiesRef);
        if (snapshot.exists()) {
            const properties = snapshot.val() || {};
            console.log("Properties loaded: ", properties);  // Debugging line
            for (let key in properties) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = properties[key].name + ' - ' + properties[key].dailyRate + ' PLN/dzień';
                propertySelect.appendChild(option);
            }
        } else {
            console.error("No properties found in the database.");
        }
    } catch (error) {
        console.error("Error fetching properties: ", error);
    }
}

// Wywołaj funkcję ładowania nieruchomości po załadowaniu strony
window.onload = loadProperties;

document.getElementById('rentalForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Pobierz wartości z formularza
    const propertySelect = document.getElementById('propertySelect');
    const propertyKey = propertySelect.value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    console.log("Form submitted with:", { propertyKey, startDate, endDate });

    // Sprawdź, czy daty są poprawne
    if (startDate > endDate) {
        alert('Data początkowa nie może być późniejsza niż data końcowa.');
        return;
    }

    // Pobierz dane nieruchomości z Firebase
    const propertyRef = ref(database, 'properties/' + propertyKey);
    try {
        const propertySnapshot = await get(propertyRef);
        if (!propertySnapshot.exists()) {
            console.error("Property not found in the database.");
            return;
        }
        const property = propertySnapshot.val();
        const dailyRate = property.dailyRate;

        console.log("Property fetched: ", property);

        // Sprawdź dostępność terminów
        const reservationsRef = ref(database, 'reservations');
        const reservationsSnapshot = await get(reservationsRef);
        const reservations = reservationsSnapshot.val() || {};
        let isAvailable = true;

        console.log("Reservations fetched: ", reservations);

        for (let key in reservations) {
            const reservation = reservations[key];
            const resStartDate = new Date(reservation.startDate);
            const resEndDate = new Date(reservation.endDate);
            if ((startDate <= resEndDate && endDate >= resStartDate)) {
                isAvailable = false;
                alert('Wybrane terminy są już zajęte.');
                break;
            }
        }

        if (isAvailable) {
            // Oblicz liczbę dni wynajmu
            const timeDiff = endDate - startDate;
            const daysRented = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

            // Oblicz całkowity koszt
            const totalCost = daysRented * dailyRate;

            console.log("Total cost calculated: ", totalCost);

            // Zapisz rezerwację w Firebase
            const newReservationRef = push(child(ref(database), 'reservations'));
            await set(newReservationRef, {
                propertyKey: propertyKey,
                startDate: startDate.toISOString().split('T')[0], // Trzymaj tylko datę
                endDate: endDate.toISOString().split('T')[0], // Trzymaj tylko datę
                totalCost: totalCost
            });

            console.log("Reservation saved successfully.");

            // Wyświetl wynik
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `Całkowity koszt wynajmu: ${totalCost.toFixed(2)} PLN za ${daysRented} dni.`;
        }
    } catch (error) {
        console.error("Error fetching property or reservations: ", error);
    }
});
