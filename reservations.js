async function makeReservation(propertyId) {
    const startDate = prompt('Enter start date (YYYY-MM-DD):');
    const endDate = prompt('Enter end date (YYYY-MM-DD):');
    const customerName = prompt('Enter your name:');
    const customerEmail = prompt('Enter your email:');

    try {
        const { data, error } = await supabase
            .from('reservations')
            .insert([
                { 
                    property_id: propertyId,
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
    } catch (error) {
        console.error('Error making reservation:', error);
        alert('Error making reservation.');
    }
}
