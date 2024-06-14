// Konfiguracja Supabase
const SUPABASE_URL = 'https://flpkrsowaueeurydbgei.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZscGtyc293YXVlZXVyeWRiZ2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNzg3NjcsImV4cCI6MjAzMzk1NDc2N30.WZJf6YG0rrM7g7weTUihwnVMQZqQEYokocMLRMK3b5g';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchProperties() {
    try {
        const { data, error } = await supabase
            .from('properties')
            .select('*');

        if (error) {
            throw error;
        }

        displayProperties(data);
    } catch (error) {
        console.error('Error fetching properties:', error);
        document.getElementById('properties').textContent = 'Error loading properties.';
    }
}

function displayProperties(properties) {
    const propertiesDiv = document.getElementById('properties');
    propertiesDiv.innerHTML = '';

    properties.forEach(property => {
        const propertyDiv = document.createElement('div');
        propertyDiv.className = 'property';
        propertyDiv.innerHTML = `
            <h2>${property.name}</h2>
            <p>Price per day: $${property.price_per_day}</p>
            <button onclick="makeReservation(${property.id})">Reserve</button>
        `;
        propertiesDiv.appendChild(propertyDiv);
    });
}

fetchProperties();
