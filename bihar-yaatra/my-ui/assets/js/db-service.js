import { db, appId } from './firebase-config.js';
import { collection, addDoc, deleteDoc, getDocs, getDoc, doc, query, where, orderBy, limit, Timestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- Helper for Paths ---
const getCollectionRef = (collectionName) => {
  return collection(db, 'artifacts', appId, 'public', 'data', collectionName);
};

const getPrivateCollectionRef = (userId, collectionName) => {
    return collection(db, 'artifacts', appId, 'users', userId, collectionName);
};

// --- Contact Form Services ---
export const submitContactForm = async (contactData) => {
  try {
    const contactsRef = getCollectionRef('contacts');
    await addDoc(contactsRef, {
      ...contactData,
      createdAt: Timestamp.now(),
      status: 'new'
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting contact:", error);
    return { success: false, error: error.message };
  }
};

// --- Homestay Services ---
export const getHomestays = async () => {
  try {
    const homestaysRef = getCollectionRef('homestays');
    const snapshot = await getDocs(homestaysRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching homestays:", error);
    return [];
  }
};

export const getHomestayById = async (id) => {
    try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'homestays', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
        console.error("Error fetching homestay:", error);
        return null;
    }
};

export const addHomestay = async (data) => {
    try {
        const ref = getCollectionRef('homestays');
        await addDoc(ref, { ...data, createdAt: Timestamp.now() });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deleteHomestay = async (id) => {
    try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'homestays', id);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// --- Package Services ---
export const getPackages = async () => {
  try {
    const packagesRef = getCollectionRef('packages');
    const snapshot = await getDocs(packagesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
};

export const addPackage = async (data) => {
    try {
        const ref = getCollectionRef('packages');
        await addDoc(ref, { ...data, createdAt: Timestamp.now() });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deletePackage = async (id) => {
    try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'packages', id);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// --- Destination Services (New) ---
export const getDestinations = async () => {
  try {
    const ref = getCollectionRef('destinations');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }
};

export const getDestinationById = async (id) => {
    try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'destinations', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
        console.error("Error fetching destination:", error);
        return null;
    }
};

// --- Transport Services (New) ---
export const getTransports = async () => {
  try {
    const ref = getCollectionRef('transports');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching transports:", error);
    return [];
  }
};

// --- Booking Services ---
export const createBooking = async (userId, bookingData) => {
    try {
        const userBookingsRef = getPrivateCollectionRef(userId, 'bookings');
        await addDoc(userBookingsRef, {
            ...bookingData,
            createdAt: Timestamp.now(),
            status: 'pending'
        });

        const publicBookingsRef = getCollectionRef('all_bookings');
        await addDoc(publicBookingsRef, {
            ...bookingData,
            userId: userId,
            createdAt: Timestamp.now(),
            status: 'pending'
        });

        return { success: true };
    } catch (error) {
        console.error("Booking failed:", error);
        return { success: false, error: error.message };
    }
};

export const getUserBookings = async (userId) => {
    try {
        const userBookingsRef = getPrivateCollectionRef(userId, 'bookings');
        const snapshot = await getDocs(userBookingsRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
};

export const getAllBookings = async () => {
    try {
        const ref = getCollectionRef('all_bookings');
        const snapshot = await getDocs(ref);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        return [];
    }
};

// --- Seed Data ---
export const seedHomestays = async () => {
    const homestays = await getHomestays();
    if (homestays.length === 0) {
        const homestaysRef = getCollectionRef('homestays');
        const dummyData = [
            {
                name: "Mithila Heritage Home",
                location: "Madhubani",
                price: "1200",
                rating: 4.8,
                image: "https://placehold.co/600x400/e67e22/ffffff?text=Mithila+Home",
                description: "Experience authentic Mithila art.",
                amenities: ["Wifi", "Breakfast"]
            },
            {
                name: "Bodh Gaya Peace Stay",
                location: "Bodh Gaya",
                price: "1500",
                rating: 4.5,
                image: "https://placehold.co/600x400/27ae60/ffffff?text=Peace+Stay",
                description: "Serene environment near the temple.",
                amenities: ["AC", "Garden"]
            }
        ];
        for (const stay of dummyData) await addDoc(homestaysRef, stay);
    }
}

export const seedDestinations = async () => {
    const destinations = await getDestinations();
    if (destinations.length === 0) {
        const ref = getCollectionRef('destinations');
        const dummy = [
            {
                name: "Bodh Gaya",
                description: "The most important Buddhist pilgrimage site in the world.",
                image: "https://placehold.co/600x400/f39c12/ffffff?text=Bodh+Gaya",
                type: "Religious"
            },
            {
                name: "Nalanda",
                description: "Site of an ancient Mahavihara, a large Buddhist monastery.",
                image: "https://placehold.co/600x400/c0392b/ffffff?text=Nalanda",
                type: "Historical"
            },
            {
                name: "Valmiki National Park",
                description: "A Tiger Reserve in the West Champaran district.",
                image: "https://placehold.co/600x400/27ae60/ffffff?text=Valmiki+Park",
                type: "Nature"
            }
        ];
        for (const d of dummy) await addDoc(ref, d);
        console.log("Seeded destinations");
    }
}

export const seedTransport = async () => {
    const transports = await getTransports();
    if (transports.length === 0) {
        const ref = getCollectionRef('transports');
        const dummy = [
            {
                name: "Toyota Innova",
                type: "SUV",
                price: "15/km",
                seats: 7,
                image: "https://placehold.co/600x400/34495e/ffffff?text=Innova"
            },
            {
                name: "Tempo Traveller",
                type: "Minibus",
                price: "25/km",
                seats: 12,
                image: "https://placehold.co/600x400/95a5a6/ffffff?text=Traveller"
            }
        ];
        for (const t of dummy) await addDoc(ref, t);
        console.log("Seeded transport");
    }
}
