import { supabase } from './config/supabase';
import dotenv from 'dotenv';
dotenv.config();

const adminId = "06ff126f-a2d0-450c-bb28-54f75e5b47f8"; // Gautam Kumar (admin)

const mockPackages = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "The Buddhist Circuit",
    slug: "the-buddhist-circuit",
    duration_days: 5,
    duration_nights: 4,
    price_per_person: 12999.00,
    cover_image_url: "https://images.unsplash.com/photo-1591264247204-74d15024b420?q=80&w=800",
    destination_ids: [],
    itinerary: [
      { day: "Day 1", title: "Patna Arrival & Sightseeing", description: "Arrival at Patna airport/junction, premium hotel check-in. Evening tour of the historical Golghar granary and Ganges riverfront walk.", meals: ["dinner"] },
      { day: "Day 2", title: "Spiritual Bodh Gaya", description: "Travel to Bodh Gaya. Meditate under the holy Bodhi Tree at the Mahabodhi Temple complex and explore international monasteries.", meals: ["breakfast", "dinner"] },
      { day: "Day 3", title: "Ancient Hills of Rajgir", description: "Excursion to Rajgir. Ride the thrilling ropeway to the Vishwa Shanti Stupa and unwind in the therapeutic Brahmakund hot sulfur springs.", meals: ["breakfast", "dinner"] },
      { day: "Day 4", title: "Intellectual Nalanda Ruins", description: "Walk through the UNESCO brick ruins of the 5th-century Nalanda University. Visit the Nalanda museum and Chinese traveler memorial.", meals: ["breakfast", "dinner"] },
      { day: "Day 5", title: "Return Departure", description: "Breakfast at hotel, drive back to Patna for your onward journey with rich memories.", meals: ["breakfast"] }
    ],
    includes: ["Premium Hotel Stay", "AC Private Cab", "Breakfast & Dinner Incl.", "English/Hindi Speaking Guide Services"],
    excludes: ["Monument Entry Fees", "Personal Expenses", "Airfare/Train Tickets"],
    max_group_size: 15,
    difficulty: "easy",
    is_published: true,
    created_by: adminId
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Wild Champaran Safaris",
    slug: "wild-champaran",
    duration_days: 3,
    duration_nights: 2,
    price_per_person: 6499.00,
    cover_image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Valmiki_Nagar_Tiger_Reserve.jpg/800px-Valmiki_Nagar_Tiger_Reserve.jpg",
    destination_ids: [],
    itinerary: [
      { day: "Day 1", title: "Forest Arrival & Safari Brief", description: "Check in at the eco-lodge inside Valmiki Nagar. Meet your expert guides for a briefing, followed by a cozy campfire dinner.", meals: ["dinner"] },
      { day: "Day 2", title: "Jungle Jeep Safari & Rafting", description: "Embark on an early morning open-jeep safari. In the afternoon, enjoy scenic boating or rafting on the Gandak river.", meals: ["breakfast", "lunch", "dinner"] },
      { day: "Day 3", title: "Birdwatching & Departure", description: "Guided forest canopy walk for morning birdwatching, followed by departure to your onward destination.", meals: ["breakfast"] }
    ],
    includes: ["Eco-Lodge Stay", "Open Jeep Safaris", "All Meals (B, L, D)", "Forest Guide", "Gandak Boating"],
    excludes: ["Camera Fees", "Tips & Gratitude", "Travel Insurance"],
    max_group_size: 6,
    difficulty: "moderate",
    is_published: true,
    created_by: adminId
  }
];

async function seed() {
  console.log("Seeding packages...");
  for (const pkg of mockPackages) {
    const { data, error } = await supabase
      .from('packages')
      .upsert(pkg)
      .select();

    if (error) {
      console.error(`Failed to seed ${pkg.title}:`, error.message);
    } else {
      console.log(`Successfully seeded package: ${pkg.title}`);
    }
  }
}

seed();
