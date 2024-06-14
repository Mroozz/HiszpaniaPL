// Konfiguracja Supabase
const SUPABASE_URL = 'https://flpkrsowaueeurydbgei.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZscGtyc293YXVlZXVyeWRiZ2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNzg3NjcsImV4cCI6MjAzMzk1NDc2N30.WZJf6YG0rrM7g7weTUihwnVMQZqQEYokocMLRMK3b5g';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchData() {
    try {
        const { data, error } = await supabase
            .from('your_table') // Zastąp nazwą swojej tabeli
            .select('*');

        if (error) {
            throw error;
        }

        displayData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('data').textContent = 'Error loading data.';
    }
}

function displayData(data) {
    const dataDiv = document.getElementById('data');
    dataDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

fetchData();
