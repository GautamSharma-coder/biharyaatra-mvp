"use server";

export type SaarthiResponse =
    | { ok: true; text: string }
    | { ok: false; error: string };

function getErrorMessage(err: unknown): string {
    if (typeof err === "object" && err !== null && "message" in err) {
        const message = (err as { message?: unknown }).message;
        if (typeof message === "string" && message.trim()) {
            return message;
        }
    }
    return "Saarthi AI is unavailable right now. Please try again.";
}

function getErrorStatus(err: unknown): number | null {
    if (typeof err === "object" && err !== null && "status" in err) {
        const status = (err as { status?: unknown }).status;
        if (typeof status === "number") {
            return status;
        }
    }
    return null;
}

function getLocalSaarthiResponse(prompt: string): string {
    const query = prompt.toLowerCase();
    
    if (query.includes("mahabodhi") || query.includes("bodh gaya") || query.includes("bodhgaya")) {
        return `**Namaste! I would love to tell you about the sacred Mahabodhi Temple in Bodh Gaya.** 🙏
        
The **Mahabodhi Temple complex** is one of the four holy sites related to the life of the Lord Buddha, and a UNESCO World Heritage Site. 

* **The Enlightenment:** It is here, under the sacred **Bodhi Tree** (a direct descendant of the original tree), that Prince Siddhartha Gautama attained supreme enlightenment (Nirvana) in 528 BCE to become the Buddha.
* **The Architecture:** The majestic central temple tower stands at an impressive **55 meters (180 feet)**, dating back to the late Gupta period (around the 5th-6th century CE). The stone railings surrounding the temple are among the oldest sculptural relics in India, carved with beautiful lotus patterns.
* **Key Attractions:** 
  - **The Vajrasana (Diamond Throne):** The sandstone slab where Buddha sat in meditation.
  - **Mucalinda Lake:** Where the snake king protected meditating Buddha from a severe storm.
  - **Monasteries:** Beautiful modern monasteries built by Buddhist nations like Japan, Thailand, and Bhutan nearby.

*💡 Local Tip: Early morning (5:00 AM - 7:00 AM) or sunset are the most peaceful times for meditation and viewing the temple under soft golden light.*`;
    }
    
    if (query.includes("nalanda")) {
        return `**Namaste! Nalanda is one of the greatest treasures of human civilization.** 📚
        
Established in the 5th century CE under the patronage of the Gupta Empire, **Nalanda University** was the world's first fully residential international university.

* **Scale of Learning:** At its peak, it housed over **10,000 students** and **2,000 teachers** from all over Asia, including China, Korea, Tibet, Central Asia, and Sri Lanka. Famous Chinese traveler **Xuanzang (Hieun Tsang)** spent years studying and teaching here.
* **The Legendary Library:** The library of Nalanda, known as *Dharmaganja* (Treasury of Truth), was three multi-story buildings named *Ratnasagara* (Ocean of Jewels), *Ratnodadhi* (Sea of Jewels), and *Ratnaranjaka* (Jewel-adorned). It held millions of manuscripts.
* **The Demise:** Tragically, the university was ransacked and destroyed in the late 12th century by Bakhtiyar Khilji. Historical accounts state the library was so vast that it burned for three consecutive months.

*💡 Local Tip: Visit the **Nalanda Ruins Archaeological Site** alongside the **Hieun Tsang Memorial Hall** nearby to see maps, paintings, and artifacts from that era.*`;
    }

    if (query.includes("rajgir")) {
        return `**Namaste! Rajgir is a serene valley surrounded by five green hills, sacred to Jains, Buddhists, and Hindus alike.** 🏔️
        
It was the ancient capital of the Magadha Empire before Pataliputra (Patna) was founded.

* **Key Spiritual Sites:**
  - **Gridhrakuta (Vulture's Peak):** Where Lord Buddha delivered many of his famous sermons, including the Lotus Sutra.
  - **Vishwa Shanti Stupa (Peace Pagoda):** A stunning white dome built by the Japanese Buddhist community on top of the Ratnagiri hill, reachable by an exciting single-cable ropeway.
  - **Saptaparni Cave:** The site of the First Buddhist Council held immediately after Buddha's Mahaparinirvana.
* **Unique Features:**
  - **Hot Springs (Brahmakund):** Naturally heated sulfur springs at the base of the hills, believed to have healing properties.
  - **Ghora Katora Lake:** A beautiful, eco-friendly pristine lake nestled between hills where only electric carts and horse carriages are allowed.

*💡 Local Tip: Take the classic Rajgir Ropeway up to the Shanti Stupa, and hire a local tonga (horse carriage) for a peaceful ride to Ghora Katora Lake.*`;
    }

    if (query.includes("food") || query.includes("litti") || query.includes("eat") || query.includes("delicacy")) {
        return `**Namaste! Bihari cuisine is rich in flavor, utilizing roasted gram flour (sattu), mustard oil, and traditional spices.** 🍲
        
Here are the culinary delicacies you must try on your journey:

1. **Litti Chokha:** The undisputed signature dish of Bihar. Whole wheat dough balls stuffed with spiced *sattu* (roasted gram flour), roasted over wood or cow-dung cakes, and dipped in pure ghee. It is served with *chokha* (smoky mashed eggplant, potatoes, and tomatoes cooked with raw mustard oil, garlic, and chilies).
2. **Khaja:** A crispy, multi-layered sweet pastry fried and dipped in sugar syrup. The town of **Silao** (near Rajgir) is legendary for its GI-tagged Silao Khaja.
3. **Tilkut:** A sweet made of pounded sesame seeds and jaggery/sugar, typical during winter in **Gaya**.
4. **Anarsa:** Rice flour and sesame seed sweets with a soft interior and crunchy exterior, famous in Gaya.
5. **Sattu Sharbat:** A savory, high-protein cooling drink made from roasted gram flour mixed with water, lemon juice, roasted cumin, black salt, and chopped mint.

*💡 Local Tip: Always eat your Litti Chokha piping hot directly from the charcoal grill!*`;
    }

    if (query.includes("transport") || query.includes("bus") || query.includes("train") || query.includes("reach") || query.includes("go to")) {
        return `**Namaste! Navigating Bihar is convenient with multiple transport circuits.** 🚗
        
Here is how to seamlessly plan your transport:

* **Air Travel:**
  - **Patna Airport (Jay Prakash Narayan Airport):** Major domestic hub connecting all Indian metro cities.
  - **Gaya International Airport:** Connects directly to international Buddhist hubs like Bangkok, Yangon, and Colombo during tourist season (October - March).
* **Rail Connectivity:**
  - Patna Junction, Gaya Junction, and Rajgir Station are major railheads. Superfast trains like the Rajdhani, Shatabdi, and Vande Bharat express connect Patna to Delhi, Kolkata, and Ranchi.
* **Road & Tours:**
  - **Bihar State Tourism Development Corporation (BSTDC):** Operates premium air-conditioned tourist buses covering the Buddhist Circuit (Patna - Bodh Gaya - Rajgir - Nalanda - Patna) and special tour packages.
  - **Taxis & Cabs:** Private cabs can be hired easily from Patna for flexible multi-city sightseeing.

*💡 Local Tip: Booking a BSTDC tour package is highly recommended for solo travelers and families as it covers certified transport, premium hotels, and expert guides in one ticket.*`;
    }

    // Default Fallback
    return `**Namaste! I am Saarthi, your AI travel concierge for the beautiful land of Bihar.** 🗺️

I would love to help you plan your journey! Bihar is the cradle of ancient empires and major world religions:
* **The Buddhist Circuit:** Explore **Bodh Gaya** (enlightenment), **Rajgir** (serene sermons), and the ruins of **Nalanda University**.
* **The Ramayana Circuit:** Visit **Janakpur/Sithamarhi** (birthplace of Sita) and **Buxar**.
* **The Heritage Cities:** Discover the rich museum culture of **Patna** (Golghar, Bihar Museum) and the historical tomb of Sher Shah Suri in **Sasaram**.
* **Eco Tourism:** Unwind in **Valmiki National Park** (tiger reserve) or the hot springs of **Rajgir**.

What specific destination, local food, or cultural experience can I guide you on today?`;
}

function getLocalJsonItinerary(prompt: string): string {
    const durationMatch = prompt.match(/(\d+)-day/);
    const duration = durationMatch ? parseInt(durationMatch[1]) : 3;
    
    // Create custom days based on duration
    const days: any[] = [];
    
    // Day 1
    days.push({
        day: 1,
        title: "Spiritual Bodh Gaya Heritage Tour",
        activities: [
            "Arrive in Bodh Gaya and check into your peaceful spiritual guest house or hotel.",
            "Visit the majestic UNESCO World Heritage Mahabodhi Temple and meditate under the sacred Bodhi Tree.",
            "Explore the spectacular 80-foot Giant Buddha Statue and surrounding foreign Buddhist monasteries (Thai, Japanese, Bhutanese).",
            "Attend the peaceful evening chanting prayer ceremony inside the Mahabodhi Temple complex."
        ],
        food: "Traditional sattvik vegetarian thali at a local spiritual cafe."
    });
    
    // Day 2
    if (duration >= 2) {
        days.push({
            day: 2,
            title: "Ancient Valleys of Rajgir & Vishwa Shanti Stupa",
            activities: [
                "Excursion to Rajgir, the ancient historic capital of the Magadha Empire.",
                "Ride the single-cable Rajgir Ropeway up to the magnificent Vishwa Shanti Stupa on Ratnagiri hill.",
                "Take a peaceful boat ride on the pristine Ghora Katora Lake surrounded by lush green hills.",
                "Visit the natural hot sulfur springs (Brahmakund) believed to have therapeutic healing properties."
            ],
            food: "Silao Khaja - multi-layered crispy sweet pastry."
        });
    }
    
    // Day 3
    if (duration >= 3) {
        days.push({
            day: 3,
            title: "Intellectual Ruins of Nalanda University",
            activities: [
                "Explore the brick archaeological ruins of the ancient Nalanda University (5th century CE).",
                "Walk through the Nalanda Archaeological Museum housing rare bronze and stone sculptures.",
                "Visit the Xuanzang (Hieun Tsang) Memorial Hall built in honor of the legendary Chinese scholar.",
                "Enjoy shopping for local stone carvings and Madhubani painting souvenirs before departure."
            ],
            food: "Sattu Paratha served with smoky brinjal chokha."
        });
    }
    
    // Day 4+
    for (let d = 4; d <= duration; d++) {
        days.push({
            day: d,
            title: `Exploration Day ${d}: Patna Heritage & Sunset Ganges Cruise`,
            activities: [
                "Visit the state-of-the-art Bihar Museum to view ancient Mauryan and Gupta treasures.",
                "Climb the unique spiral staircase of the historic Golghar granary for panoramic views of Patna.",
                "Take a peaceful sunset motorboat cruise along the River Ganges from Gandhi Ghat.",
                "Visit the holy Takht Sri Patna Sahib, the beautiful birthplace of Guru Gobind Singh Ji."
            ],
            food: "Piping-hot Litti Chokha with ghee and smoky tomato chokha."
        });
    }

    const result = {
        trip_title: `Enchanting Bihar ${duration}-Day Heritage Journey`,
        summary: `A premium tailor-made ${duration}-day journey tracing ancient empires, spiritual roots, and delicious culinary traditions.`,
        days: days
    };

    return JSON.stringify(result, null, 2);
}

export async function askSaarthi(prompt: string): Promise<SaarthiResponse> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;
    const isPlaceholder = !apiKey || 
                          apiKey.includes("your_actual_gemini_key_here") || 
                          apiKey.includes("placeholder") || 
                          apiKey === "your_gemini_api_key" ||
                          apiKey.trim() === "";

    const isJsonRequest = prompt.includes("JSON") || prompt.includes("trip_title") || prompt.includes("activities");

    if (isPlaceholder) {
        // Fallback to high-fidelity local response
        const fallbackText = isJsonRequest ? getLocalJsonItinerary(prompt) : getLocalSaarthiResponse(prompt);
        return { ok: true, text: fallbackText };
    }

    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction:
                "You are Saarthi, a helpful AI travel guide for Bihar. You specialize in Bihar's history (Nalanda, Rajgir), spirituality (Bodh Gaya), and modern travel tips. Keep responses helpful, culturally respectful, and concise.",
        });

        const result = await model.generateContent(prompt);
        return { ok: true, text: result.response.text() };
    } catch (err) {
        console.warn("Gemini API call failed, falling back to local Saarthi responder:", err);
        const fallbackText = isJsonRequest ? getLocalJsonItinerary(prompt) : getLocalSaarthiResponse(prompt);
        return { ok: true, text: fallbackText };
    }
}
