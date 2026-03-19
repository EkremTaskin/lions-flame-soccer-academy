import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const submitContactForm = async (formData) => {
    if (!db) {
        console.warn("Firebase is not initialized. Falling back to mock.");
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
    }
    
    try {
        await addDoc(collection(db, "contacts"), {
            ...formData,
            createdAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error("Error adding contact form:", error);
        throw error;
    }
};

export const fetchAvailableSlots = async (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;

    let startTime = isWeekend ? 9 : 17;
    let endTime = 21;

    const allSlots = [];
    for (let hour = startTime; hour < endTime; hour++) {
        const h1 = hour % 12 || 12;
        const ampm1 = hour >= 12 ? 'PM' : 'AM';
        allSlots.push(`${h1}:00 ${ampm1}`);

        const h2 = hour % 12 || 12;
        const ampm2 = hour >= 12 ? 'PM' : 'AM';
        allSlots.push(`${h2}:30 ${ampm2}`);
    }

    if (!db) {
        console.warn("Firebase is not initialized. Falling back to mock slots.");
        return new Promise(resolve => {
            setTimeout(() => {
                const availableSlots = allSlots.filter(() => Math.random() > 0.3);
                resolve(availableSlots);
            }, 1000);
        });
    }

    try {
        const q = query(collection(db, "bookings"), where("date", "==", dateStr));
        const querySnapshot = await getDocs(q);
        
        const bookedSlots = [];
        querySnapshot.forEach((doc) => {
            bookedSlots.push(doc.data().time);
        });

        // Filter out already booked slots
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
        return availableSlots;
    } catch (error) {
        console.error("Error fetching slots from Firebase:", error);
        return allSlots; // fallback to showing all
    }
};

export const submitBooking = async (bookingData) => {
    if (!db) {
        console.warn("Firebase is not initialized. Falling back to mock booking.");
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
    }

    try {
        await addDoc(collection(db, "bookings"), {
            ...bookingData,
            createdAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error("Error adding booking:", error);
        throw error;
    }
};
