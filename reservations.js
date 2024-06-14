// Konfiguracja Supabase
const SUPABASE_URL = 'https://flpkrsowaueeurydbgei.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZscGtyc293YXVlZXVyeWRiZ2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNzg3NjcsImV4cCI6MjAzMzk1NDc2N30.WZJf6YG0rrM7g7weTUihwnVMQZqQEYokocMLRMK3b5g';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let calendar;
let currentPropertyId;

async function fetchReservations(propertyId) {
    try {
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .eq('property_id', propertyId);

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return [];
    }
}

function showCalendar(propertyId, propertyName) {
    currentPropertyId = propertyId;

    document.getElementById('properties').style.display = 'none';
    document.getElementById('calendar').style.display = 'block';

    const calendarEl = document.getElementById('calendar');

    if (calendar) {
        calendar.destroy();
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        select: function (info) {
            handleDateSelect(info);
        },
        events: async function (fetchInfo, successCallback, failureCallback) {
            const reservations = await fetchReservations(propertyId);
            const events = reservations.map(reservation => ({
                title: `${reservation.customer_name} (${reservation.customer_email})`,
                start: reservation.start_date,
                end: reservation.end_date
            }));
            successCallback(events);
        }
    });

    calendar.render();
}

async function handleDateSelect(info) {
    const startDate = info.startStr;
    const endDate = info.endStr;
    const customerName = prompt('Enter your name:');
    const customerEmail = prompt('Enter your email:');

    if (!customerName || !customerEmail) {
        alert('Reservation cancelled.');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('reservations')
            .insert([
                {
                    property_id: currentPropertyId,
                    start_date: startDate,
                    end_date: endDate,
                    customer_name: customerName,
                    customer_email: customerEmail
                }
            ]);

        if (error) {
            throw error;
        }

        alert('Reservation successful!');
        calendar.refetchEvents();
    } catch (error) {
        console.error('Error making reservation:', error);
        alert('Error making reservation.');
    }
}
