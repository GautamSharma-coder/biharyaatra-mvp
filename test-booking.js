const http = require('http');

async function testBookingFlow() {
  try {
    // 1. Register a new user
    const regRes = await fetch('http://localhost:8000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Booking Test User",
        email: "booking_test_" + Date.now() + "@test.com",
        password: "password123",
        phone: "1234567890"
      })
    });
    
    const regData = await regRes.json();
    console.log('Register:', regRes.status, regData);
    if (regRes.status !== 201) return;

    // Simulate OTP verification directly in DB (bypass email check for testing)
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL || 'https://edxczodmjnthfhdtrjlm.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
    await supabase.from('users').update({ is_verified: true }).eq('email', regData.email);

    // 2. Login
    const loginRes = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regData.email,
        password: "password123"
      })
    });
    const loginData = await loginRes.json();
    console.log('Login:', loginRes.status, loginData.message || loginData.error);
    
    // Extract cookies for auth
    const cookies = loginRes.headers.get('set-cookie');
    
    // 3. Make a booking
    const bookRes = await fetch('http://localhost:8000/api/v1/bookings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify({
        service_type: "package",
        service_id: "00000000-0000-0000-0000-000000000000", // Dummy UUID for now, just to see if it reaches logic
        service_name: "Test Package",
        guests: 2
      })
    });

    const bookData = await bookRes.json();
    console.log('Booking:', bookRes.status, bookData);

  } catch (error) {
    console.error(error);
  }
}

testBookingFlow();
