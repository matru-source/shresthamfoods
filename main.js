/**
 * SHRESTHAM - Traditional Wood Pressed Mustard Oil
 * Interactive UI Engine, 360 Viewer & Subscription Engine
 */

// ==========================================================================
// Configurable Target WhatsApp & Orders Local Database Engine
// ==========================================================================
const DEFAULT_WHATSAPP_NUMBER = "919777221665";
const ORDERS_STORAGE_KEY = "shrestham_orders";
const WHATSAPP_STORAGE_KEY = "shrestham_store_whatsapp";

function getStoreWhatsAppNumber() {
  const saved = localStorage.getItem(WHATSAPP_STORAGE_KEY);
  if (saved && saved !== "919876543210") {
    return saved;
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

function setStoreWhatsAppNumber(num) {
  const clean = (num || "").replace(/\D/g, "");
  if (!clean || clean.length < 10) return false;
  const finalNum = clean.length === 10 ? `91${clean}` : clean;
  localStorage.setItem(WHATSAPP_STORAGE_KEY, finalNum);
  return finalNum;
}

function getOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Discard any dummy demo orders previously saved
        const realOrders = parsed.filter(o => 
          o && 
          o.id !== "ORD-942817" && 
          o.id !== "SUB-813904" && 
          o.id !== "ORD-721540" &&
          o.customerName !== "Rahul Sharma" &&
          o.customerName !== "Ananya Mukherjee" &&
          o.customerName !== "Vikram Malhotra"
        );
        return realOrders;
      }
    }
  } catch (err) {
    console.error("Error reading orders:", err);
  }

  return [];
}

function saveOrder(order) {
  try {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Error saving order:", err);
  }
}

function deleteOrder(orderId) {
  try {
    let orders = getOrders();
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Error deleting order:", err);
  }
}

function generateCartWhatsAppUrl(order) {
  const storePhone = getStoreWhatsAppNumber();
  const text = 
`🛍️ *NEW ORDER - SHRESTHAM MUSTARD OIL*
━━━━━━━━━━━━━━━━━━━━━
📋 *Order ID:* #${order.id}
📅 *Date:* ${order.date}

👤 *CUSTOMER DETAILS:*
• *Name:* ${order.customerName}
• *Phone:* ${order.phone}
• *Address:* ${order.address}, ${order.cityPincode}

📦 *ITEMS ORDERED & QUANTITY:*
${order.itemsDescription}

💰 *TOTAL PAYABLE:*
• *Grand Total:* ₹${Number(order.totalAmount).toLocaleString("en-IN")}
• *Payment Mode:* ${order.paymentMethod}
• *Delivery:* 100% FREE Doorstep Express 🚚

━━━━━━━━━━━━━━━━━━━━━
_Please confirm my order and share dispatch tracking details._ 🙏`;

  return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
}

function generateSubscriptionWhatsAppUrl(order, orderId) {
  const storePhone = getStoreWhatsAppNumber();
  const text = 
`🌿 *NEW MONTHLY SUBSCRIPTION - SHRESTHAM*
━━━━━━━━━━━━━━━━━━━━━
📋 *Subscription ID:* #${orderId || order.id}
📅 *Date:* ${order.date}

👤 *SUBSCRIBER DETAILS:*
• *Name:* ${order.customerName}
• *Phone:* ${order.phone}
• *Address:* ${order.address}, ${order.cityPincode}

📦 *MONTHLY SUPPLY & QUANTITY:*
• *Monthly Quantity:* ${order.monthlyQuantity} Bottles (1 Litre each)
• *Price per Bottle:* ₹350 (Monthly Subscriber Discount)
• *Preferred Cycle:* ${order.deliveryCycle}
• *Doorstep Delivery:* 100% FREE 🚚

💰 *MONTHLY TOTAL:* ₹${Number(order.totalAmount).toLocaleString("en-IN")} / month
• *Payment Mode:* ${order.paymentMethod || "Cash on Delivery"}
${order.notes ? `• *Special Notes:* ${order.notes}\n` : ""}
━━━━━━━━━━━━━━━━━━━━━
_Please enroll our kitchen in the monthly fresh-press replenishment._ 🙏`;

  return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
}


document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // Product Data - Single 1L Bottle @ ₹370
  // ==========================================
  const productData = {
    title: "Shrestham Wood Pressed Mustard Oil (1 Litre)",
    price: 370,
    mrp: 449,
    discount: "18% OFF",
    saveText: "Save ₹79",
    sku: "SHR-MO-1L",
    image: "assets/PRODUCT(Bottle image).png",
    tagline: "100% Pure, Unrefined Traditional Kachi Ghani Oil"
  };

  let quantity = 1;
  let cart = [];
  let appliedDiscount = 0; // percentage

  // ==========================================
  // 360 Degree Product Angle Data
  // ==========================================
  const anglesData = [
    { id: 1, label: "1. FRONT VIEW", file: "assets/view/angle-1.png" },
    { id: 2, label: "2. FRONT-RIGHT ANGLE", file: "assets/view/angle-2.png" },
    { id: 3, label: "3. RIGHT SIDE VIEW", file: "assets/view/angle-3.png" },
    { id: 4, label: "4. BACK VIEW (NUTRITION)", file: "assets/view/angle-4.png" },
    { id: 5, label: "5. LEFT SIDE VIEW", file: "assets/view/angle-5.png" },
    { id: 6, label: "6. BACK-RIGHT ANGLE", file: "assets/view/angle-6.png" },
    { id: 7, label: "7. LEFT-REAR (FSSAI & SPECS)", file: "assets/view/angle-7.png" },
    { id: 8, label: "8. 360° COMPLETE VIEW", file: "assets/view/angle-8.png" }
  ];

  let currentAngleIndex = 0;

  // Recipes Data for Interactive Modals
  const recipesData = {
    kosha_murgi: {
      title: "Kosha Murgi — Bengal",
      time: "50 mins",
      servings: "4 People",
      spice: "Rich, Fiery & Robust",
      image: "assets/recipies/kosha-murgi.jpg",
      description: "A legendary Bengali classic cooked in dark brass vessels. Chicken pieces slow-braised (koshano) with sliced onions, ginger-garlic paste, and warming garam masala until the gravy turns glossy, dark mahogany and releases the deep aroma of cold-pressed mustard oil.",
      ingredients: [
        "750g Country chicken (curry cut)",
        "5 tbsp Shrestham Wood Pressed Mustard Oil",
        "3 Large onions (thinly sliced) & 1 onion paste",
        "2 tbsp Ginger-garlic paste",
        "1/2 cup Whisked yogurt",
        "Whole spices: 2 bay leaves, 4 green cardamoms, 1 cinnamon stick, 4 cloves",
        "1 tsp Turmeric, 1.5 tbsp Kashmiri red chilli powder, 1 tsp Cumin powder",
        "1/2 tsp Shahi garam masala powder",
        "Salt to taste, 1 tsp sugar (for caramelizing color)"
      ],
      steps: [
        "Marinate chicken with yogurt, turmeric, 1 tbsp mustard oil, and salt for 45 minutes.",
        "Heat Shrestham mustard oil in a heavy iron or brass kadai until it smokes gently; sprinkle 1 tsp sugar to caramelize into a deep rich amber.",
        "Temper with bay leaves, cardamoms, cloves, and cinnamon. Sauté sliced onions until deep golden brown.",
        "Add ginger-garlic paste and powdered spices with a splash of warm water; sauté on medium flame until oil separates.",
        "Add chicken pieces and 'kosha' (slow-fry and braise) uncovered on medium flame for 20-25 minutes, stirring continuously so spices cling to the meat.",
        "Add 1 cup hot water, cover and simmer until chicken is meltingly tender. Finish with 1 tbsp raw Shrestham mustard oil and shahi garam masala."
      ],
      chefTip: "The secret to the authentic dark Kosha colour is caramelizing sugar in hot mustard oil before adding whole spices, followed by patient slow-braising ('koshano') without adding water too early."
    },
    aloo_posto: {
      title: "Aloo Posto — West Bengal",
      time: "30 mins",
      servings: "4 People",
      spice: "Mild, Nutty & Earthy",
      image: "assets/recipies/aloo-posto.jpg",
      description: "An iconic West Bengal household staple featuring soft golden potato cubes enveloped in a velvety stone-ground poppy seed (posto) paste, punctuated with spicy green chillies and crowned with the raw pungent punch of cold-pressed mustard oil.",
      ingredients: [
        "4 Large potatoes (peeled and diced into 1-inch cubes)",
        "4 tbsp Shrestham Wood Pressed Mustard Oil",
        "4 tbsp White poppy seeds (posto), soaked in warm water and ground to a silk-smooth paste with 2 green chillies",
        "1/2 tsp Kalonji (nigella seeds)",
        "4-5 Slit fresh green chillies",
        "1/2 tsp Turmeric powder",
        "Salt to taste",
        "1/2 cup Warm water"
      ],
      steps: [
        "Soak poppy seeds in warm water for 20 minutes, then grind on a traditional shil-nora or high-speed blender into a thick, milky white paste.",
        "Heat 3 tbsp Shrestham mustard oil in a kadai until shimmering. Temper with kalonji seeds and 2 slit green chillies until they crackle.",
        "Add the cubed potatoes and turmeric; fry gently on medium heat for 4-5 minutes until the edges are light golden.",
        "Pour in 1/2 cup warm water and salt; cover and cook on low heat until the potatoes are just fork-tender.",
        "Fold in the freshly ground poppy seed paste and remaining slit green chillies. Simmer for 2-3 minutes until the posto clings affectionately to every potato piece.",
        "Turn off the heat and instantly drizzle 1 generous tablespoon of raw, unheated Shrestham mustard oil over the top. Cover for 2 minutes to lock in the aroma."
      ],
      chefTip: "Never overcook or fry the poppy seed paste at high heat or it loses its delicate sweet aroma. The raw mustard oil drizzle at the very end is what makes authentic Aloo Posto come alive."
    },
    chana_dal: {
      title: "Chana Dal with Mustard Tadka — Bengal",
      time: "40 mins",
      servings: "4-5 People",
      spice: "Golden, Sweet & Pungent",
      image: "assets/recipies/chana-dal.jpg",
      description: "A celebratory Bengal classic (Cholar Dal) made from split Bengal gram slow-simmered with aromatic whole spices, fried crunchy coconut slivers, and finished with a crackling, golden-highlighted mustard oil tempering.",
      ingredients: [
        "1 cup Chana dal (Bengal gram), washed and soaked for 1 hour",
        "3.5 tbsp Shrestham Wood Pressed Mustard Oil",
        "1/4 cup Fresh coconut slices (thinly cut into small batons)",
        "Whole spices: 2 bay leaves, 2 dry red chillies, 1-inch cinnamon stick, 3 green cardamoms, 3 cloves",
        "1 tsp Cumin seeds & 1/2 tsp Hing (asafoetida)",
        "1.5 tbsp Fresh ginger paste",
        "1/2 tsp Turmeric powder, 1 tsp Kashmiri red chilli powder",
        "1.5 tbsp Sugar (traditional mild sweetness) & Salt to taste",
        "1/2 tsp Bengali garam masala & 1 tsp Ghee (optional)"
      ],
      steps: [
        "Pressure cook soaked chana dal with turmeric, salt, 2 crushed cardamoms, and 2.5 cups water for 3-4 whistles until cooked through but retaining individual grain shape.",
        "Heat 1 tbsp Shrestham mustard oil in a pan; fry the thin coconut slivers until fragrant and reddish-gold. Drain and keep aside.",
        "In the same pan, add remaining mustard oil and heat until shimmering. Add cumin seeds, hing, bay leaves, dry red chillies, cinnamon, cardamoms, and cloves.",
        "Stir in ginger paste with a splash of water, turmeric, and red chilli powder. Sauté on low flame until the oil releases and aromatics bloom.",
        "Pour the boiled dal into the fragrant tadka pan. Add sugar and mix gently without mashing the lentils. Simmer for 6-8 minutes until rich and velvety.",
        "Garnish with the fried crunchy coconut bits, fresh green chillies, and an extra drizzle of raw Shrestham mustard oil."
      ],
      chefTip: "Traditional Cholar Dal pairs best with hot puffed luchis. Tempering with cumin, hing, and mustard oil brings out the earthy, sweet profile that defines Bengali festive feasts."
    },
    chingudi_besara: {
      title: "Chingudi Besara — Odisha",
      time: "35 mins",
      servings: "3-4 People",
      spice: "Coastal, Tangy & Pungent",
      image: "assets/recipies/chingudi-besara.jpg",
      description: "A treasured jewel of coastal Odia cuisine. Fresh tender prawns gently simmered in a pungent stone-ground mustard paste (Besara) along with garlic, green chillies, and sun-dried sour mango (Ambula), finished with pure cold-pressed mustard oil.",
      ingredients: [
        "400g Fresh prawns (cleaned, deveined, with tails intact)",
        "4 tbsp Shrestham Wood Pressed Mustard Oil",
        "Besara paste: 2 tbsp yellow mustard seeds, 1 tbsp black mustard seeds, 1 tsp cumin seeds, 6 garlic cloves, 3 green chillies (ground smooth with water)",
        "1 Dried mango slice (Ambula) soaked in 3 tbsp warm water (or 1 small raw tomato/kokum)",
        "1/2 tsp Panch phoron (five-spice mix)",
        "1 Medium potato or pointed gourd (potol), diced (optional)",
        "1/2 tsp Turmeric powder & 1/2 tsp Red chilli powder",
        "Salt to taste, fresh coriander leaves"
      ],
      steps: [
        "Marinate cleaned prawns with salt, turmeric, and 1 tsp Shrestham mustard oil for 10 minutes.",
        "Heat 2 tbsp Shrestham mustard oil in a coastal clay pot or kadai. Lightly sauté prawns for 1-2 minutes until they turn pink; immediately transfer to a bowl.",
        "In the same oil, add panch phoron and let the seeds crackle aromatically.",
        "Strain the ground Besara paste through a sieve into the pan (to remove bitter mustard husks) along with 1 cup of warm water and turmeric.",
        "Add the soaked sour ambula (dry mango) and bring the gravy to a gentle, steady simmer on low-medium flame.",
        "Slip the seared prawns back into the bubbling gravy. Cook gently for 3-4 minutes so the prawns absorb the mustard garlic tang.",
        "Turn off heat and finish with 1 tablespoon of raw Shrestham cold-pressed mustard oil and slit green chillies."
      ],
      chefTip: "Always strain the Besara paste before cooking to prevent bitterness, and never boil mustard paste on high heat. The sour ambula balances the pungent mustard kick beautifully."
    },
    shorshe_shobji: {
      title: "Shorshe Shobji — Bengal",
      time: "30 mins",
      servings: "4 People",
      spice: "Pungent, Fresh & Earthy",
      image: "assets/recipies/shorshe-shobji.jpg",
      description: "A vibrant Bengali medley of crisp seasonal vegetables—cauliflower florets, sweet pumpkin, eggplant, and drumsticks—gently braised in a golden mustard and radhuni paste, showcasing the pure culinary elevation of cold-pressed mustard oil.",
      ingredients: [
        "3 cups Mixed seasonal vegetables (drumstick batons, pumpkin cubes, potato wedges, cauliflower florets, brinjal cubes)",
        "4 tbsp Shrestham Wood Pressed Mustard Oil",
        "3 tbsp Yellow mustard seed paste (blended smooth with 2 green chillies and a pinch of salt)",
        "1/2 tsp Radhuni (wild celery seeds) or Panch Phoron",
        "4 Green chillies (slit)",
        "1/2 tsp Turmeric powder",
        "Salt to taste, 1/2 tsp sugar",
        "1/2 cup Warm water"
      ],
      steps: [
        "Heat 2.5 tbsp Shrestham mustard oil in a broad pan until smoking point. Lightly fry cauliflower and potato wedges first, then add eggplant and pumpkin until lightly colored.",
        "Push vegetables to one side; temper the remaining oil with radhuni seeds and slit green chillies until fragrant.",
        "Add turmeric, salt, and 1/2 cup warm water. Cover and cook on medium flame for 7-8 minutes until vegetables are just tender.",
        "Whisk the yellow mustard paste with 2 tablespoons of warm water and fold gently into the simmering vegetables.",
        "Simmer on low heat for 2 minutes, allowing the piquant mustard sauce to coat each vegetable without drying out completely.",
        "Turn off the stove. Drizzle 1.5 tablespoons of raw cold-pressed Shrestham mustard oil across the dish and rest covered for 3 minutes before serving."
      ],
      chefTip: "Radhuni seeds paired with Shrestham mustard oil produce the quintessential aroma of traditional Bengali grandma-style vegetable curries."
    },
    luchi_dum: {
      title: "Luchi and Aloo Dum — Bengal",
      time: "45 mins",
      servings: "4 People",
      spice: "Festive, Tangy & Warming",
      image: "assets/recipies/luchi-aloo-dum.jpg",
      description: "The crown jewel of Bengali Sunday breakfasts and Durga Puja festivities. Crisp, puffed, golden luchis served beside baby potatoes braised in a velvety tomato-ginger gravy spiced with hing, roasted cumin, and cold-pressed mustard oil.",
      ingredients: [
        "500g Baby potatoes (boiled, peeled, and pricked with a fork)",
        "For Aloo Dum: 4 tbsp Shrestham Wood Pressed Mustard Oil, 1/2 tsp Hing, 1 tsp Cumin seeds, 2 Bay leaves, 1.5 tbsp Ginger paste, 1 cup Pureed tomatoes, 1/2 cup Green peas (Koraishuti), 1/2 tsp Turmeric, 1.5 tsp Kashmiri chilli, 1 tsp Bhaja masala (roasted cumin-coriander-dry chilli)",
        "For Luchis: 2 cups Maida (all-purpose flour), 2 tbsp Shrestham oil (for moyan/shortening), 1/2 tsp salt, warm water to knead, oil for deep frying"
      ],
      steps: [
        "Knead maida with salt, 2 tbsp Shrestham oil (moyan), and warm water into a soft, supple dough. Rest for 20 minutes, then roll into thin discs.",
        "Heat Shrestham mustard oil in a heavy kadai until shimmering. Shallow fry the pricked baby potatoes with a pinch of turmeric and salt until golden-crusted; remove.",
        "In the same hot mustard oil, temper with bay leaves, cumin seeds, and a generous pinch of hing until aromatic.",
        "Add ginger paste and pureed tomatoes; cook on medium flame until oil separates. Stir in green peas, turmeric, and chilli powder.",
        "Add the golden potatoes and 1 cup water. Simmer until the sauce thickens into a clingy, rich gravy. Sprinkle bhaja masala and fresh coriander.",
        "Deep fry the rolled luchis in hot oil—they will instantly puff into pristine golden spheres. Serve immediately alongside piping hot Aloo Dum."
      ],
      chefTip: "Adding 2 tablespoons of pure mustard oil directly into the flour dough ('moyan') lends luchis an incredible flakiness and subtle nutty aroma."
    },
    desi_mutton: {
      title: "Desi Mutton Curry — Jharkhand",
      time: "1 hour 30 mins",
      servings: "4-5 People",
      spice: "Rustic, Fiery & Earthen",
      image: "assets/recipies/desi-mutton-curry.jpg",
      description: "A slow-cooked village marvel inspired by Jharkhand and Bihar rustic Champaran traditions. Tender goat meat slow-braised in a sealed earthen Handi with whole garlic bulbs, crushed whole spices, and copious unrefined mustard oil over low embers.",
      ingredients: [
        "1 kg Fresh tender mutton (bone-in, curry cut)",
        "6 tbsp Shrestham Wood Pressed Mustard Oil",
        "4 Whole garlic bulbs (tops trimmed, left intact)",
        "500g Onions (thinly sliced)",
        "Whole spices: 3 Black cardamoms, 5 Green cardamoms, 2 Bay leaves, 6 Cloves, 2-inch Cinnamon, 1 tbsp Whole black peppercorns",
        "2 tbsp Crushed rustic ginger and garlic",
        "1.5 tbsp Crushed red chilli flakes, 1 tbsp Coriander powder, 1 tsp Turmeric",
        "Salt to taste, whole green chillies"
      ],
      steps: [
        "In an earthen handi or heavy cast-iron Dutch oven, place raw mutton, sliced onions, whole intact garlic bulbs, crushed ginger-garlic, all powdered spices, whole spices, and salt.",
        "Heat Shrestham mustard oil until smoking, then let it cool slightly. Pour the warm aromatic golden oil directly over the mutton mix.",
        "Use hands or a wooden spoon to thoroughly massage and coat every piece of meat with the onion-oil marinade.",
        "Cover the handi with an earthenware lid and seal the edges with a ribbon of wheat dough (Dum style).",
        "Place over very low flame (or indirect heat) and slow-cook undisturbed for 60-70 minutes, allowing the onions to melt into their own savory juices.",
        "Break the dough seal, uncover, and braise on medium heat for 10-15 minutes until the oil surfaces in rich crimson rings and the meat slips effortlessly off the bone."
      ],
      chefTip: "The unrefined mustard oil breaks down mutton collagen during the slow sealed braise, yielding incomparably tender meat with authentic rustic village depth."
    },
    kerala_fish: {
      title: "Kerala-Style Fish Fry — Kerala",
      time: "25 mins",
      servings: "3-4 People",
      spice: "Fiery, Tangy & Crunchy",
      image: "assets/recipies/kerala-fish-fry.jpg",
      description: "A beloved coastal southern specialty. Firm fish steaks marinated in a fiery crimson paste of Kashmiri chilli, shallots, garlic, crushed black pepper, and curry leaves, pan-seared to a crackling crisp in aromatic cold-pressed mustard oil.",
      ingredients: [
        "500g Firm fish steaks (Kingfish/Surmai, Pomfret or Seer fish)",
        "4-5 tbsp Shrestham Wood Pressed Mustard Oil (for shallow pan-frying)",
        "Marinade paste: 2 tbsp Kashmiri red chilli powder, 1/2 tsp Turmeric, 1 tbsp Fresh ginger-garlic paste, 6 Small shallots (crushed), 1 sprig Curry leaves (finely chopped), 1 tbsp Lemon juice or vinegar, 1 tsp Freshly crushed black pepper, 1 tbsp Rice flour (for crispiness), Salt to taste"
      ],
      steps: [
        "Make 2-3 diagonal slashes on both sides of each fish steak so spices penetrate deep into the flesh.",
        "Mix all marinade ingredients with 1 tablespoon of Shrestham mustard oil and lemon juice into a thick, fiery red paste.",
        "Generously rub the marinade into the incisions and across the entire fish. Rest for 25-30 minutes.",
        "Heat 3-4 tbsp Shrestham mustard oil in a seasoned cast-iron skillet until medium-hot; scatter a handful of fresh curry leaves into the oil for aroma.",
        "Place the marinated fish steaks in the sizzling skillet. Pan-fry uncovered on medium heat for 4-5 minutes until the underside forms a dark, crunchy crust.",
        "Flip gently and sear the other side for 3-4 minutes until cooked through and thoroughly crisped. Serve hot on fresh green banana leaf with lime wedges and onion rings."
      ],
      chefTip: "The high smoke point and pungent undertones of cold-pressed mustard oil create an unbeatable crackling crust that locks in the fish's natural juices."
    },
    panta_bhat: {
      title: "Panta Bhat — Rural Bengal",
      time: "15 mins (+ overnight fermentation)",
      servings: "2-3 People",
      spice: "Cooling, Pungent & Probiotic",
      image: "assets/recipies/panta-bhat.jpg",
      description: "The soul food of rural Bengal and ancient Indian heritage. Fragrant cooked rice steeped in water overnight to naturally ferment into a rich probiotic elixir, served in earthenware alongside raw crunchy onions, roasted green chillies, and an essential swirl of raw cold-pressed mustard oil.",
      ingredients: [
        "2 cups Cooked short-grain or parboiled rice (cooked and cooled to room temperature)",
        "3.5 cups Filtered drinking water",
        "2.5 tbsp Raw Shrestham Wood Pressed Mustard Oil",
        "1 Medium red onion (finely sliced or crushed)",
        "3 Fresh green chillies (charred or slit raw)",
        "1/2 tsp Roasted cumin powder & Rock salt (bit noon) to taste",
        "Accompaniments: Fried crispy fish (Machher Bhaja), mashed potatoes (Aloo Bhate), or lentil fritters (Pora)"
      ],
      steps: [
        "In a traditional clay or terracotta bowl, place the cooked room-temperature rice and pour drinking water until the rice is fully submerged.",
        "Cover loosely with a clean muslin cloth or lid and let it ferment at room temperature for 10-14 hours overnight.",
        "The next morning, the fermented rice water will develop a refreshing, mildly tart, probiotic aroma.",
        "Season with rock salt and a light sprinkle of roasted cumin powder. Gently mix with a traditional wooden spoon.",
        "Right before enjoying, pour a lavish stream of raw, unheated Shrestham cold-pressed mustard oil over the bowl.",
        "Eat by hand, biting into raw crunchy onions and fiery green chillies between spoonfuls of cool fermented rice."
      ],
      chefTip: "Raw wood-pressed mustard oil is the heart and soul of Panta Bhat. Its natural antibacterial and warming properties perfectly balance the cooling fermented rice."
    },
    shorshe: {
      title: "Authentic Bengali Shorshe Maach (Mustard Fish)",
      time: "35 mins",
      servings: "4 People",
      spice: "Bold Pungent",
      image: "assets/recipies/fish curry.png",
      description: "A timeless Bengali masterpiece where succulent fish steaks are simmered in an aromatic freshly ground mustard paste gravy, enhanced by the raw pungent punch of cold-pressed Shrestham mustard oil.",
      ingredients: [
        "500g Fish fillets (Rohu, Katla or Hilsa)",
        "4 tbsp Shrestham Wood Pressed Mustard Oil",
        "2 tbsp Yellow & Black mustard seeds (soaked & ground)",
        "4 Fresh green chillies (slit lengthwise)",
        "1/2 tsp Turmeric powder & Kashmiri red chilli powder",
        "1/2 tsp Kalonji (nigella seeds)",
        "Salt to taste & warm water"
      ],
      steps: [
        "Marinate fish steaks with turmeric, salt, and 1 tbsp Shrestham mustard oil for 15 minutes.",
        "Gently sear the fish in smoking hot Shrestham mustard oil for 1-2 minutes per side; remove and set aside.",
        "In the remaining golden oil, temper with kalonji and slit green chillies until aromatic.",
        "Add the smooth mustard paste with a splash of warm water and turmeric; bring to a gentle simmer.",
        "Slip the seared fish back into the simmering gravy. Drizzle 1 tbsp raw Shrestham mustard oil on top just before taking off the flame to capture the authentic nostril-tingling 'Jhaal' aroma!"
      ],
      chefTip: "Never boil mustard paste on high flame for long, as it can turn bitter. Always finish with a generous drizzle of raw unheated cold-pressed oil!"
    },
    achar: {
      title: "Dadi Ma's Traditional Punjabi Aam Ka Achar",
      time: "45 mins + Sun Cure",
      servings: "1.5 kg Jar",
      spice: "Bold & Tangy",
      image: "assets/recipies/pickle.png",
      description: "The classic raw green mango pickle that stays fresh, crunchy, and preservative-free for years thanks to the natural antibacterial properties of pure wood-pressed mustard oil.",
      ingredients: [
        "1 kg Firm raw green mangoes (washed, dried & cubed)",
        "300ml Shrestham Wood Pressed Mustard Oil",
        "3 tbsp Fennel seeds (Saunf), coarsely crushed",
        "2 tbsp Fenugreek seeds (Methi dana)",
        "2 tbsp Yellow mustard seeds (Rai kuria)",
        "1 tbsp Nigella seeds (Kalonji)",
        "2 tbsp Red chilli powder & 1 tbsp Turmeric powder",
        "4 tbsp Rock salt"
      ],
      steps: [
        "Toss cut raw mangoes with salt and turmeric, letting them sweat moisture for 6-8 hours, then dry under morning sun for 4 hours.",
        "Gently heat Shrestham mustard oil in a pan until it reaches its smoke point, then turn off flame and let it cool to lukewarm.",
        "In a large earthen bowl, mix all whole & cracked spices, then fold in the sun-dried mango cubes.",
        "Pour the cooled aromatic mustard oil over the spiced mangoes, ensuring every piece is coated.",
        "Transfer to a sterile ceramic martaban (jar). Top up with remaining oil so mangoes are submerged. Keep under warm sunlight for 5-7 days."
      ],
      chefTip: "Pure wood-pressed mustard oil acts as a 100% natural organic preservative. Never allow moisture into your pickle jar."
    },
    saag: {
      title: "Slow-Cooked Punjabi Sarson Ka Saag",
      time: "1 hour 20 mins",
      servings: "5 People",
      spice: "Earthy & Rich",
      image: "assets/recipies/sarson ka saag.png",
      description: "The soul of winter dining. Fresh mustard greens slow-simmered with bathua and spinach, seasoned with garlic, ginger, and tempered in traditional wood-pressed mustard oil.",
      ingredients: [
        "500g Fresh tender mustard leaves (Sarson)",
        "250g Spinach leaves (Palak)",
        "150g Bathua leaves",
        "4 tbsp Shrestham Wood Pressed Mustard Oil",
        "3 tbsp Makki ka atta (maize flour)",
        "2 tbsp Chopped garlic & 2 tbsp julienned ginger",
        "3 Whole dry red chillies",
        "Salt to taste, fresh homemade butter for serving"
      ],
      steps: [
        "Wash and finely chop sarson, palak, and bathua greens. Pressure cook or slow simmer with ginger, garlic, and green chillies until tender.",
        "Mash the greens coarsely using a traditional wooden masher (Mathani).",
        "Whisk maize flour with a cup of warm water and stir continuously into the greens, simmering for 25 minutes until glossy.",
        "In a small iron tadka pan, heat 3 tbsp Shrestham mustard oil until shimmering. Add garlic, whole red chillies, and asafoetida.",
        "Pour the sizzling tadka over the saag. Serve piping hot with Makki di Roti and jaggery!"
      ],
      chefTip: "Tempering in mustard oil rather than butter at the start gives the saag its signature rustic earthy depth."
    }
  };

  // ==========================================
  // DOM Elements - Product
  // ==========================================
  const currentPriceEl = document.getElementById("current-price");
  const mrpPriceEl = document.getElementById("mrp-price");
  const discountBadgeEl = document.getElementById("discount-badge");
  const qtyInput = document.getElementById("qty-input");
  const qtyMinusBtn = document.getElementById("qty-minus");
  const qtyPlusBtn = document.getElementById("qty-plus");
  const addToCartBtn = document.getElementById("btn-add-to-cart");
  const cartToggleBtn = document.getElementById("cart-toggle-btn");
  const cartDrawer = document.getElementById("cart-drawer");
  const cartBackdrop = document.getElementById("cart-backdrop");
  const cartCloseBtn = document.getElementById("cart-close-btn");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartSubtotalEl = document.getElementById("cart-subtotal");
  const cartDiscountRow = document.getElementById("cart-discount-row");
  const cartDiscountAmountEl = document.getElementById("cart-discount-amount");
  const cartShippingEl = document.getElementById("cart-shipping");
  const cartGrandTotalEl = document.getElementById("cart-grand-total");
  const cartCountBadges = document.querySelectorAll(".cart-count-badge");
  const couponInput = document.getElementById("coupon-input");
  const applyCouponBtn = document.getElementById("apply-coupon-btn");
  const checkoutBtn = document.getElementById("checkout-btn");

  // 360 Viewer Elements
  const viewerImg = document.getElementById("viewer-360-img");
  const viewerSlider = document.getElementById("viewer-360-slider");
  const viewerBadge = document.getElementById("viewer-360-badge");
  const viewerPrevBtn = document.getElementById("viewer-prev-btn");
  const viewerNextBtn = document.getElementById("viewer-next-btn");
  const viewerContainer = document.getElementById("viewer-360-container");

  // Sticky Mobile Bar
  const stickyMobileBar = document.getElementById("sticky-mobile-bar");
  const stickyPriceEl = document.getElementById("sticky-price");
  const stickyAddCartBtn = document.getElementById("sticky-add-cart-btn");

  // Site Header
  const siteHeader = document.querySelector(".site-header");

  // Modals
  const labCertModal = document.getElementById("lab-cert-modal");
  const viewLabTagBtn = document.getElementById("view-lab-tag-btn");
  const openLabModalLinks = document.querySelectorAll(".open-lab-modal");
  const recipeModal = document.getElementById("recipe-modal");
  const processModal = document.getElementById("process-modal");
  const watchProcessBtn = document.getElementById("watch-process-btn");
  const modalCloseBtns = document.querySelectorAll(".modal-close-btn");
  const modalOverlays = document.querySelectorAll(".modal-overlay");

  // ==========================================
  // Header Scroll Effect
  // ==========================================
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }

    const heroSection = document.getElementById("hero");
    if (heroSection) {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      if (heroBottom < 100 && window.innerWidth <= 768) {
        stickyMobileBar.style.display = "flex";
      } else {
        stickyMobileBar.style.display = "none";
      }
    }
  });

  // ==========================================
  // Update Product Pricing Display (₹370 single unit)
  // ==========================================
  function updateProductView() {
    const unitPrice = productData.price;
    const unitMrp = productData.mrp;
    const totalPrice = unitPrice * quantity;
    const totalMrp = unitMrp * quantity;

    if (currentPriceEl) currentPriceEl.textContent = `₹${totalPrice.toLocaleString("en-IN")}`;
    if (mrpPriceEl) mrpPriceEl.textContent = `₹${totalMrp.toLocaleString("en-IN")}`;
    if (discountBadgeEl) discountBadgeEl.textContent = productData.discount;

    if (stickyPriceEl) {
      stickyPriceEl.textContent = `₹${unitPrice}`;
    }
  }

  // ==========================================
  // Quantity Controls (+ / -)
  // ==========================================
  if (qtyMinusBtn && qtyPlusBtn && qtyInput) {
    qtyMinusBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        qtyInput.value = quantity;
        updateProductView();
      }
    });

    qtyPlusBtn.addEventListener("click", () => {
      if (quantity < 50) {
        quantity++;
        qtyInput.value = quantity;
        updateProductView();
      }
    });

    qtyInput.addEventListener("change", () => {
      let val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 50) val = 50;
      quantity = val;
      qtyInput.value = quantity;
      updateProductView();
    });
  }

  // ==========================================
  // 3D Pop-Out Bottle on Scroll (Tilted 45deg)
  // ==========================================
  const popBottle = document.getElementById("main-product-img");
  const stageCard = document.getElementById("product-stage-card");

  if (popBottle && stageCard) {
    // IntersectionObserver triggers every time user scrolls into this portion (up or down)
    const popObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            popBottle.classList.add("is-popped");
          } else {
            // Reset when scrolled out of view so it returns straight inside card
            popBottle.classList.remove("is-popped");
            popBottle.style.transform = "";
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    popObserver.observe(stageCard);
  }

  // ==========================================
  // Shopping Cart Logic
  // ==========================================
  function addToCart(qty) {
    const existingIndex = cart.findIndex(item => item.sku === productData.sku);

    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({
        sku: productData.sku,
        title: productData.title,
        price: productData.price,
        mrp: productData.mrp,
        image: productData.image,
        qty: qty
      });
    }

    renderCart();
    openCart();
    showToast(`Added ${qty}x ${productData.title} to your kitchen cart! 🌿`);
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      addToCart(quantity);
    });
  }

  if (stickyAddCartBtn) {
    stickyAddCartBtn.addEventListener("click", () => {
      addToCart(1);
    });
  }

  function renderCart() {
    const totalCount = cart.reduce((acc, curr) => acc + curr.qty, 0);
    cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? "flex" : "none";
    });

    const cartDrawerBadge = document.getElementById("cart-drawer-badge");
    if (cartDrawerBadge) {
      cartDrawerBadge.textContent = totalCount;
    }

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p>Your pantry cart is currently empty.</p>
          <button class="btn btn-primary" onclick="document.getElementById('product-section').scrollIntoView({behavior: 'smooth'}); closeCart();" style="margin-top: 14px; font-size: 0.88rem; padding: 10px 22px;">Explore Fresh Oils</button>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = "₹0";
      if (cartGrandTotalEl) cartGrandTotalEl.textContent = "₹0";
      if (cartShippingEl) {
        cartShippingEl.textContent = "FREE";
        cartShippingEl.style.color = "var(--color-green-600)";
        cartShippingEl.style.fontWeight = "700";
      }
      if (cartDiscountRow) cartDiscountRow.style.display = "none";
      return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = "";

    cart.forEach((item, idx) => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;

      const itemRow = document.createElement("div");
      itemRow.className = "cart-item-row";
      itemRow.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-info">
          <h4>${item.title}</h4>
          <span>₹${item.price} per bottle</span>
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
            <button class="qty-btn" style="width: 26px; height: 26px; border-radius: 4px; font-size: 0.85rem;" data-action="decrease" data-idx="${idx}">-</button>
            <span style="font-weight: 700; font-size: 0.9rem;">${item.qty}</span>
            <button class="qty-btn" style="width: 26px; height: 26px; border-radius: 4px; font-size: 0.85rem;" data-action="increase" data-idx="${idx}">+</button>
          </div>
        </div>
        <div style="text-align: right;">
          <div class="cart-item-price">₹${itemTotal.toLocaleString("en-IN")}</div>
          <button class="cart-item-remove" data-action="remove" data-idx="${idx}" title="Remove item">&times;</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemRow);
    });

    // Calculations - 100% Free express shipping across India as guaranteed on landing page
    const shipping = 0;
    const discountAmount = Math.round(subtotal * (appliedDiscount / 100));
    const grandTotal = subtotal - discountAmount + shipping;

    if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
    if (cartShippingEl) {
      cartShippingEl.textContent = "FREE";
      cartShippingEl.style.color = "var(--color-green-600)";
      cartShippingEl.style.fontWeight = "700";
    }

    if (appliedDiscount > 0) {
      if (cartDiscountRow) cartDiscountRow.style.display = "flex";
      if (cartDiscountAmountEl) cartDiscountAmountEl.textContent = `-₹${discountAmount.toLocaleString("en-IN")} (${appliedDiscount}% OFF)`;
    } else {
      if (cartDiscountRow) cartDiscountRow.style.display = "none";
    }

    if (cartGrandTotalEl) cartGrandTotalEl.textContent = `₹${grandTotal.toLocaleString("en-IN")}`;

    // Item events
    cartItemsContainer.querySelectorAll("button[data-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        if (action === "increase") {
          cart[idx].qty++;
        } else if (action === "decrease") {
          if (cart[idx].qty > 1) {
            cart[idx].qty--;
          } else {
            cart.splice(idx, 1);
          }
        } else if (action === "remove") {
          cart.splice(idx, 1);
        }
        renderCart();
      });
    });
  }

  function openCart() {
    if (cartDrawer) cartDrawer.classList.add("active");
    if (cartBackdrop) cartBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove("active");
    if (cartBackdrop) cartBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener("click", openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);

  // Promo Code
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener("click", () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === "SHRESTHAM15" || code === "PURE15") {
        appliedDiscount = 15;
        showToast("Coupon Applied! 15% discount has been deducted 🎉");
        renderCart();
      } else if (code === "") {
        showToast("Please enter a coupon code");
      } else {
        showToast("Invalid code. Try using 'SHRESTHAM15' for 15% off!");
      }
    });
  }

  // ==========================================
  // Quick Checkout Modal & WhatsApp Order Flow
  // ==========================================
  const checkoutModal = document.getElementById("checkout-modal");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutSummaryItems = document.getElementById("checkout-summary-items");
  const checkoutSummaryTotal = document.getElementById("checkout-summary-total");
  const btnQuickWhatsAppOrder = document.getElementById("btn-quick-whatsapp-order");

  let quickOrderData = null;

  // Direct "Instant Order on WhatsApp" from Product Showcase
  if (btnQuickWhatsAppOrder) {
    btnQuickWhatsAppOrder.addEventListener("click", () => {
      quickOrderData = {
        qty: quantity,
        price: productData.price,
        title: productData.title
      };
      if (checkoutSummaryItems) {
        checkoutSummaryItems.textContent = `${quantity}x ${productData.title}`;
      }
      if (checkoutSummaryTotal) {
        checkoutSummaryTotal.textContent = `₹${(quantity * productData.price).toLocaleString("en-IN")}`;
      }
      openModal(checkoutModal);
    });
  }

  // Cart Drawer Checkout Trigger
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Your pantry cart is currently empty!");
        return;
      }
      quickOrderData = null; // Use cart items
      closeCart();

      const subtotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
      const discountAmount = Math.round(subtotal * (appliedDiscount / 100));
      const grandTotal = subtotal - discountAmount;
      const itemsList = cart.map(item => `${item.qty}x ${item.title}`).join(", ");

      if (checkoutSummaryItems) checkoutSummaryItems.textContent = itemsList;
      if (checkoutSummaryTotal) checkoutSummaryTotal.textContent = `₹${grandTotal.toLocaleString("en-IN")}`;

      openModal(checkoutModal);
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", e => {
      e.preventDefault();

      const name = document.getElementById("checkout-name").value.trim();
      const phone = document.getElementById("checkout-phone").value.trim();
      const address = document.getElementById("checkout-address").value.trim();
      const city = document.getElementById("checkout-city").value.trim();
      const pincode = document.getElementById("checkout-pincode").value.trim();
      const paymentMethod = document.getElementById("checkout-payment").value;

      let itemsText = "";
      let grandTotal = 0;

      if (quickOrderData) {
        itemsText = `• ${quickOrderData.qty}x ${quickOrderData.title} (₹${quickOrderData.qty * quickOrderData.price})`;
        grandTotal = quickOrderData.qty * quickOrderData.price;
        quickOrderData = null;
      } else {
        const subtotal = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
        const discountAmount = Math.round(subtotal * (appliedDiscount / 100));
        grandTotal = subtotal - discountAmount;
        itemsText = cart.map(item => `• ${item.qty}x ${item.title} (₹${item.price * item.qty})`).join("\n");
      }

      const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

      const cartOrder = {
        id: orderId,
        type: "cart",
        typeLabel: "Pantry Cart",
        customerName: name,
        phone: phone,
        address: address,
        cityPincode: `${city} - ${pincode}`,
        itemsDescription: itemsText,
        totalAmount: grandTotal,
        paymentMethod: paymentMethod,
        notes: "Express Doorstep Delivery",
        status: "Confirmed",
        date: new Date().toLocaleDateString("en-IN") + " " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      };

      saveOrder(cartOrder);
      const whatsappUrl = generateCartWhatsAppUrl(cartOrder);

      // Open WhatsApp automatically
      window.open(whatsappUrl, "_blank");

      closeModal(checkoutModal);
      checkoutForm.reset();

      cart = [];
      renderCart();

      showCartOrderConfirmation(cartOrder, whatsappUrl);
    });
  }

  function showCartOrderConfirmation(order, whatsappUrl) {
    const confirmationModal = document.createElement("div");
    confirmationModal.className = "modal-overlay active";
    confirmationModal.innerHTML = `
      <div class="modal-box" style="text-align: center; max-width: 500px;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--color-green-100); color: var(--color-green-600); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; font-size: 2.2rem;">
          ✓
        </div>
        <h3 style="font-family: var(--font-serif); font-size: 1.8rem; color: var(--color-maroon-800); margin-bottom: 8px;">Order Forwarded to WhatsApp!</h3>
        <p style="color: var(--color-text-secondary); margin-bottom: 20px; font-size: 0.95rem;">
          Thank you, <strong>${order.customerName}</strong>! Your order <strong>#${order.id}</strong> has been saved and forwarded to our official WhatsApp order line.
        </p>
        <div style="background: var(--color-ivory); border: 1.5px solid var(--color-gold-400); border-radius: var(--radius-md); padding: 16px; margin-bottom: 24px; text-align: left; font-size: 0.88rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Total Amount:</span>
            <strong style="color: var(--color-maroon-800); font-size: 1.05rem;">₹${order.totalAmount.toLocaleString("en-IN")}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: var(--color-text-muted);">Payment:</span>
            <strong>${order.paymentMethod}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--color-text-muted);">Deliver To:</span>
            <span style="text-align: right; max-width: 220px;">${order.address}, ${order.cityPincode}</span>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="${whatsappUrl}" target="_blank" class="btn btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>Open WhatsApp Chat 💬</span>
          </a>
          <button class="btn btn-secondary" id="order-success-close-btn" style="width: 100%;">
            Continue Shopping
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmationModal);
    document.body.style.overflow = "hidden";

    document.getElementById("order-success-close-btn").addEventListener("click", () => {
      confirmationModal.remove();
      document.body.style.overflow = "";
    });
  }

  // ==========================================
  // Monthly Subscription Form Logic & Pricing Engine
  // (Quantity * ₹350, Free Delivery)
  // ==========================================
  const subQtyInput = document.getElementById("sub-qty-input");
  const subQtyMinusBtn = document.getElementById("sub-qty-minus");
  const subQtyPlusBtn = document.getElementById("sub-qty-plus");
  const subCalcQtyDisplay = document.getElementById("sub-calc-qty");
  const subCalcSubtotalDisplay = document.getElementById("sub-calc-subtotal");
  const subCalcSavingsDisplay = document.getElementById("sub-calc-savings");
  const subCalcGrandTotalDisplay = document.getElementById("sub-calc-grand-total");
  const subscriptionForm = document.getElementById("monthly-subscription-form");

  let monthlyQty = 2; // Default 2 bottles/month
  const MONTHLY_RATE = 350; // Discounted subscription rate
  const STANDARD_RATE = 370; // Standard retail rate

  function updateSubscriptionCalculator() {
    if (monthlyQty < 1) monthlyQty = 1;
    if (monthlyQty > 50) monthlyQty = 50;

    if (subQtyInput) subQtyInput.value = monthlyQty;
    if (subCalcQtyDisplay) subCalcQtyDisplay.textContent = `${monthlyQty} ${monthlyQty === 1 ? 'Bottle' : 'Bottles'} (1L)`;

    const totalAmount = monthlyQty * MONTHLY_RATE;
    const regularAmount = monthlyQty * STANDARD_RATE;
    const monthlySavings = regularAmount - totalAmount;

    if (subCalcSubtotalDisplay) subCalcSubtotalDisplay.textContent = `₹${totalAmount.toLocaleString("en-IN")}`;
    if (subCalcSavingsDisplay) subCalcSavingsDisplay.textContent = `₹${monthlySavings.toLocaleString("en-IN")}`;
    if (subCalcGrandTotalDisplay) subCalcGrandTotalDisplay.textContent = `₹${totalAmount.toLocaleString("en-IN")}`;

    // Update compact mobile live total displays
    const subInlineCalcTotal = document.getElementById("sub-inline-calc-total");
    const subMobileGrandTotal = document.getElementById("sub-mobile-grand-total");
    const subMobileSavingBadge = document.getElementById("sub-mobile-saving-badge");
    if (subInlineCalcTotal) subInlineCalcTotal.textContent = `₹${totalAmount.toLocaleString("en-IN")}`;
    if (subMobileGrandTotal) subMobileGrandTotal.textContent = `₹${totalAmount.toLocaleString("en-IN")}`;
    if (subMobileSavingBadge) subMobileSavingBadge.textContent = `Save ₹${monthlySavings.toLocaleString("en-IN")}`;
  }

  if (subQtyMinusBtn && subQtyPlusBtn && subQtyInput) {
    subQtyMinusBtn.addEventListener("click", () => {
      if (monthlyQty > 1) {
        monthlyQty--;
        updateSubscriptionCalculator();
      }
    });

    subQtyPlusBtn.addEventListener("click", () => {
      if (monthlyQty < 50) {
        monthlyQty++;
        updateSubscriptionCalculator();
      }
    });

    subQtyInput.addEventListener("change", () => {
      let val = parseInt(subQtyInput.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      monthlyQty = val;
      updateSubscriptionCalculator();
    });
  }

  // Handle Monthly Subscription Submission
  if (subscriptionForm) {
    subscriptionForm.addEventListener("submit", e => {
      e.preventDefault();

      const fullName = document.getElementById("sub-name").value.trim();
      const phone = document.getElementById("sub-phone").value.trim();
      const address = document.getElementById("sub-address").value.trim();
      const cityPincode = document.getElementById("sub-city-pincode").value.trim();
      const deliveryCycle = document.getElementById("sub-cycle").value;
      const notes = document.getElementById("sub-notes").value.trim();

      if (!fullName || !phone || !address || !cityPincode) {
        showToast("Please fill all required delivery details!");
        return;
      }

      const totalMonthlyPayable = monthlyQty * MONTHLY_RATE;
      const orderId = "SUB-" + Math.floor(100000 + Math.random() * 900000);

      // Construct order object
      const subscriptionOrder = {
        id: orderId,
        type: "subscription",
        typeLabel: "Monthly Kitchen Club",
        customerName: fullName,
        phone: phone,
        address: address,
        cityPincode: cityPincode,
        deliveryCycle: deliveryCycle,
        notes: notes,
        monthlyQuantity: monthlyQty,
        itemsDescription: `${monthlyQty}x 1L Bottles (@ ₹350/mo)`,
        totalAmount: totalMonthlyPayable,
        paymentMethod: "Cash on Delivery",
        status: "Confirmed",
        date: new Date().toLocaleDateString("en-IN") + " " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      };

      // Save to local storage database for Admin Dashboard
      saveOrder(subscriptionOrder);

      // Generate WhatsApp order URL
      const whatsappUrl = generateSubscriptionWhatsAppUrl(subscriptionOrder, orderId);

      // Open WhatsApp automatically
      window.open(whatsappUrl, "_blank");

      // Show celebratory confirmation modal
      showSubscriptionSuccessModal(subscriptionOrder, whatsappUrl);

      // Reset form
      subscriptionForm.reset();
      monthlyQty = 2;
      updateSubscriptionCalculator();
    });
  }

  function showSubscriptionSuccessModal(lead, whatsappUrl) {
    const subModal = document.createElement("div");
    subModal.className = "modal-overlay active";
    subModal.innerHTML = `
      <div class="modal-box" style="text-align: center; max-width: 540px;">
        <div style="width: 76px; height: 76px; border-radius: 50%; background: linear-gradient(135deg, var(--color-gold-400), var(--color-gold-500)); color: var(--color-earth-900); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; font-size: 2.4rem; box-shadow: var(--shadow-gold);">
          🌿
        </div>
        <h3 style="font-family: var(--font-serif); font-size: 1.85rem; color: var(--color-maroon-800); margin-bottom: 8px;">
          Subscription Forwarded to WhatsApp!
        </h3>
        <p style="color: var(--color-text-secondary); margin-bottom: 22px; font-size: 0.95rem;">
          Welcome to the Shrestham Monthly Kitchen Supply Club, <strong>${lead.customerName}</strong>! Your order <strong>#${lead.id}</strong> has been saved and forwarded to our official WhatsApp order desk.
        </p>

        <div style="background: var(--color-ivory); border: 2px solid var(--color-gold-400); border-radius: var(--radius-md); padding: 18px 20px; text-align: left; margin-bottom: 24px; font-size: 0.88rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--color-text-muted);">Monthly Supply:</span>
            <strong>${lead.monthlyQuantity} x 1L Bottles (@ ₹350 each)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--color-text-muted);">Delivery Cycle:</span>
            <strong>${lead.deliveryCycle}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--color-text-muted);">Delivery Charges:</span>
            <strong style="color: var(--color-green-600);">100% FREE DOORSTEP DELIVERY</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; border-top: 1px dashed var(--color-cream-200); padding-top: 8px;">
            <span style="color: var(--color-text-muted);">Deliver To:</span>
            <span style="text-align: right; max-width: 240px; font-weight: 600;">${lead.address}, ${lead.cityPincode}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--color-cream-200); padding-top: 10px; margin-top: 6px; font-size: 1.1rem; color: var(--color-maroon-800); font-weight: 800;">
            <span>Monthly Total:</span>
            <span>₹${lead.totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div style="display: flex; gap: 12px; flex-direction: column;">
          <a href="${whatsappUrl}" target="_blank" class="btn btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>Send Order via WhatsApp 💬</span>
          </a>
          <button class="btn btn-secondary" id="sub-success-close-btn" style="width: 100%;">
            Done & Return to Page
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(subModal);
    document.body.style.overflow = "hidden";

    document.getElementById("sub-success-close-btn").addEventListener("click", () => {
      subModal.remove();
      document.body.style.overflow = "";
    });
  }

  // ==========================================
  // Store Orders Admin Dashboard Logic
  // ==========================================
  const adminModal = document.getElementById("admin-modal");
  const adminModalCloseBtn = document.getElementById("admin-modal-close-btn");
  const adminLogoutBtn = document.getElementById("admin-logout-btn");
  const adminOrdersContainer = document.getElementById("admin-orders-container");
  const adminSearchInput = document.getElementById("admin-search-input");
  const adminExportBtn = document.getElementById("admin-export-btn");
  const adminClearBtn = document.getElementById("admin-clear-btn");
  const adminWhatsAppInput = document.getElementById("admin-whatsapp-input");
  const adminSavePhoneBtn = document.getElementById("admin-save-phone-btn");
  let currentAdminFilter = "all";

  // Restricted Admin Authentication Elements
  const adminLoginModal = document.getElementById("admin-login-modal");
  const adminLoginForm = document.getElementById("admin-login-form");
  const adminLoginId = document.getElementById("admin-login-id");
  const adminLoginPass = document.getElementById("admin-login-pass");
  const adminLoginError = document.getElementById("admin-login-error");
  const adminTogglePassBtn = document.getElementById("admin-toggle-pass-btn");
  const adminLoginCloseBtn = document.getElementById("admin-login-close-btn");

  const VALID_ADMIN_IDS = ["shrestham"];
  const DEFAULT_ADMIN_PASS = "@shrestham2026";

  function getAdminPassword() {
    return localStorage.getItem("shrestham_admin_pass") || DEFAULT_ADMIN_PASS;
  }

  function isAdminAuthenticated() {
    return sessionStorage.getItem("shrestham_admin_auth") === "true";
  }

  // Secret URL routing: checks /admin, /admin/, or #admin
  function checkAdminRoute() {
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, "");
    const isPathAdmin = path.endsWith("/admin");
    const isHashAdmin = window.location.hash.toLowerCase() === "#admin";

    if (isPathAdmin || isHashAdmin) {
      if (isAdminAuthenticated()) {
        renderAdminDashboard();
        openModal(adminModal);
      } else {
        openModal(adminLoginModal);
      }
    }
  }

  // Listen for route changes
  window.addEventListener("hashchange", checkAdminRoute);
  window.addEventListener("popstate", checkAdminRoute);

  // Hidden Keyboard Shortcut (Ctrl+Shift+A or Alt+A)
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") || (e.altKey && e.key.toLowerCase() === "a")) {
      e.preventDefault();
      if (isAdminAuthenticated()) {
        renderAdminDashboard();
        openModal(adminModal);
      } else {
        openModal(adminLoginModal);
      }
    }
  });

  // Toggle Password Visibility
  if (adminTogglePassBtn && adminLoginPass) {
    adminTogglePassBtn.addEventListener("click", () => {
      const isPass = adminLoginPass.type === "password";
      adminLoginPass.type = isPass ? "text" : "password";
      adminTogglePassBtn.textContent = isPass ? "🙈" : "👁️";
    });
  }

  // Admin Login Form Submission
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", e => {
      e.preventDefault();
      const enteredId = (adminLoginId ? adminLoginId.value.trim().toLowerCase() : "");
      const enteredPass = (adminLoginPass ? adminLoginPass.value : "");
      const validPass = getAdminPassword();

      if (VALID_ADMIN_IDS.includes(enteredId) && (enteredPass === validPass || enteredPass === "@shrestham2026")) {
        sessionStorage.setItem("shrestham_admin_auth", "true");
        if (adminLoginError) adminLoginError.style.display = "none";
        closeModal(adminLoginModal);
        adminLoginForm.reset();
        renderAdminDashboard();
        openModal(adminModal);
        showToast("Access Granted. Welcome to Store Admin! 🔐");
      } else {
        if (adminLoginError) adminLoginError.style.display = "block";
        if (adminLoginPass) {
          adminLoginPass.value = "";
          adminLoginPass.focus();
        }
      }
    });
  }

  // Close Login Modal & reset URL
  if (adminLoginCloseBtn) {
    adminLoginCloseBtn.addEventListener("click", () => {
      closeModal(adminLoginModal);
      if (window.location.hash.toLowerCase() === "#admin") {
        history.replaceState(null, "", window.location.pathname.replace(/\/admin\/?$/i, "/"));
      }
    });
  }

  // Close Admin Modal & reset URL
  if (adminModalCloseBtn) {
    adminModalCloseBtn.addEventListener("click", () => {
      closeModal(adminModal);
      if (window.location.hash.toLowerCase() === "#admin" || window.location.pathname.toLowerCase().endsWith("/admin")) {
        history.replaceState(null, "", "/");
      }
    });
  }

  // Log Out
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("shrestham_admin_auth");
      closeModal(adminModal);
      if (window.location.hash.toLowerCase() === "#admin" || window.location.pathname.toLowerCase().endsWith("/admin")) {
        history.replaceState(null, "", "/");
      }
      showToast("Logged out of Admin Portal 🔒");
    });
  }

  // WhatsApp Phone Number Configuration in Admin
  if (adminSavePhoneBtn && adminWhatsAppInput) {
    adminSavePhoneBtn.addEventListener("click", () => {
      const val = adminWhatsAppInput.value.trim();
      const saved = setStoreWhatsAppNumber(val);
      if (saved) {
        showToast(`Store WhatsApp updated to +${saved}! 📱`);
      } else {
        showToast("Please enter a valid 10-digit Indian mobile number.");
      }
    });
  }

  function renderAdminDashboard() {
    if (!adminOrdersContainer) return;

    if (adminWhatsAppInput) {
      adminWhatsAppInput.value = getStoreWhatsAppNumber();
    }

    const orders = getOrders();
    const query = adminSearchInput ? adminSearchInput.value.trim().toLowerCase() : "";

    // Stats calculations
    const totalCount = orders.length;
    const subCount = orders.filter(o => o.type === "subscription").length;
    const cartCount = orders.filter(o => o.type === "cart").length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const statTotalEl = document.getElementById("admin-stat-total");
    const statRevEl = document.getElementById("admin-stat-revenue");
    const statSubsEl = document.getElementById("admin-stat-subs");
    const statCartEl = document.getElementById("admin-stat-cart");

    if (statTotalEl) statTotalEl.textContent = totalCount;
    if (statRevEl) statRevEl.textContent = `₹${totalRevenue.toLocaleString("en-IN")}`;
    if (statSubsEl) statSubsEl.textContent = subCount;
    if (statCartEl) statCartEl.textContent = cartCount;

    const tabAll = document.getElementById("tab-count-all");
    const tabSub = document.getElementById("tab-count-sub");
    const tabCart = document.getElementById("tab-count-cart");
    if (tabAll) tabAll.textContent = totalCount;
    if (tabSub) tabSub.textContent = subCount;
    if (tabCart) tabCart.textContent = cartCount;

    // Filter by Tab
    let filtered = orders;
    if (currentAdminFilter === "subscription") {
      filtered = filtered.filter(o => o.type === "subscription");
    } else if (currentAdminFilter === "cart") {
      filtered = filtered.filter(o => o.type === "cart");
    }

    // Filter by Search Query
    if (query) {
      filtered = filtered.filter(o =>
        (o.customerName && o.customerName.toLowerCase().includes(query)) ||
        (o.phone && o.phone.toLowerCase().includes(query)) ||
        (o.cityPincode && o.cityPincode.toLowerCase().includes(query)) ||
        (o.id && o.id.toLowerCase().includes(query))
      );
    }

    if (filtered.length === 0) {
      adminOrdersContainer.innerHTML = `
        <div class="admin-empty-state" style="padding: 48px 20px; text-align: center;">
          <p style="font-size: 1.15rem; margin-bottom: 6px; color: var(--color-earth-900); font-weight: 700;">No customer orders yet</p>
          <span style="font-size: 0.86rem; color: var(--color-text-secondary); max-width: 420px; display: inline-block;">
            Real customer orders placed via WhatsApp Checkout or Monthly Kitchen Supply will appear here in real time.
          </span>
        </div>
      `;
      return;
    }

    adminOrdersContainer.innerHTML = filtered.map(o => {
      const isSub = o.type === "subscription";
      const badgeClass = isSub ? "badge-sub" : "badge-cart";
      const cleanCustomerPhone = o.phone ? o.phone.replace(/\D/g, "") : "";
      const waMsg = encodeURIComponent(`Hello ${o.customerName}, this is Shrestham Wood Pressed Mustard Oil regarding your Order #${o.id}.`);
      const waLink = `https://wa.me/91${cleanCustomerPhone.slice(-10)}?text=${waMsg}`;

      return `
        <div class="admin-order-item" id="admin-row-${o.id}">
          <div>
            <strong style="color: var(--color-maroon-800); font-size: 0.95rem;">#${o.id}</strong>
            <span style="display: block; font-size: 0.74rem; color: var(--color-text-muted);">${o.date}</span>
            <span class="admin-order-type-badge ${badgeClass}">${o.typeLabel || (isSub ? "Subscription" : "Cart")}</span>
          </div>

          <div>
            <strong style="display: block; font-size: 0.95rem; color: var(--color-earth-900);">${o.customerName}</strong>
            <span style="font-size: 0.82rem; color: var(--color-text-secondary); display: block;">📞 <a href="tel:${o.phone}" style="color: inherit; text-decoration: underline;">${o.phone}</a></span>
            <span style="font-size: 0.8rem; color: var(--color-text-muted); display: block;">📍 ${o.address}, ${o.cityPincode}</span>
          </div>

          <div>
            <span style="font-size: 0.85rem; color: var(--color-earth-900); display: block; font-weight: 600;">${o.itemsDescription}</span>
            <span style="font-size: 0.76rem; color: var(--color-text-muted);">${o.paymentMethod || "Cash on Delivery"} • ${o.deliveryCycle || "Standard Delivery"}</span>
          </div>

          <div>
            <span style="font-size: 1.15rem; font-weight: 800; color: var(--color-maroon-800); display: block;">₹${(o.totalAmount || 0).toLocaleString("en-IN")}</span>
            <span style="font-size: 0.72rem; color: var(--color-green-600); font-weight: 700;">FREE Delivery</span>
          </div>

          <div class="admin-action-btn-group">
            <a href="${waLink}" target="_blank" class="admin-whatsapp-btn" title="Chat with customer on WhatsApp">
              💬 WhatsApp
            </a>
            <a href="tel:${o.phone}" class="admin-call-btn" title="Call customer">
              📞 Call
            </a>
            <button class="admin-del-btn" data-del-id="${o.id}" title="Delete order">&times;</button>
          </div>
        </div>
      `;
    }).join("");

    // Wire single delete buttons
    adminOrdersContainer.querySelectorAll("[data-del-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-del-id");
        if (confirm(`Are you sure you want to delete Order #${id}?`)) {
          deleteOrder(id);
          renderAdminDashboard();
        }
      });
    });
  }

  function exportOrdersToCSV() {
    const orders = getOrders();
    if (orders.length === 0) {
      showToast("No orders available to export!");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Type,Date,Customer Name,Phone,Address,City & Pincode,Items,Total (INR),Payment Method,Status\n";

    orders.forEach(o => {
      const row = [
        o.id,
        o.typeLabel || o.type,
        `"${o.date}"`,
        `"${o.customerName}"`,
        `"${o.phone}"`,
        `"${(o.address || "").replace(/"/g, '""')}"`,
        `"${o.cityPincode || ""}"`,
        `"${(o.itemsDescription || "").replace(/"/g, '""')}"`,
        o.totalAmount,
        `"${o.paymentMethod || ""}"`,
        o.status || "Confirmed"
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shrestham_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("Exported all orders to CSV successfully! 📥");
  }

  document.querySelectorAll(".admin-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentAdminFilter = tab.getAttribute("data-filter");
      renderAdminDashboard();
    });
  });

  if (adminSearchInput) {
    adminSearchInput.addEventListener("input", () => {
      renderAdminDashboard();
    });
  }

  if (adminExportBtn) {
    adminExportBtn.addEventListener("click", exportOrdersToCSV);
  }

  if (adminClearBtn) {
    adminClearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear orders database?")) {
        localStorage.removeItem(ORDERS_STORAGE_KEY);
        renderAdminDashboard();
        showToast("Orders database cleared!");
      }
    });
  }

  // Check admin route immediately on load
  checkAdminRoute();

  // ==========================================
  // Modals Management
  // ==========================================
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (viewLabTagBtn) {
    viewLabTagBtn.addEventListener("click", () => openModal(labCertModal));
  }
  openLabModalLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      openModal(labCertModal);
    });
  });

  if (watchProcessBtn) {
    watchProcessBtn.addEventListener("click", () => openModal(processModal));
  }

  // Recipe Modal Triggers
  document.querySelectorAll(".open-recipe-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const recipeKey = btn.getAttribute("data-recipe");
      const recipe = recipesData[recipeKey];
      if (!recipe) return;

      const modalImg = document.getElementById("recipe-modal-img");
      const modalTitle = document.getElementById("recipe-modal-title");
      const modalTime = document.getElementById("recipe-modal-time");
      const modalSpice = document.getElementById("recipe-modal-spice");
      const modalServings = document.getElementById("recipe-modal-servings");
      const modalDesc = document.getElementById("recipe-modal-desc");
      const modalIngredients = document.getElementById("recipe-modal-ingredients");
      const modalSteps = document.getElementById("recipe-modal-steps");
      const modalChefTip = document.getElementById("recipe-modal-chef-tip");

      if (modalImg && recipe.image) {
        modalImg.src = recipe.image;
        modalImg.alt = recipe.title;
      }
      if (modalTitle) modalTitle.textContent = recipe.title;
      if (modalTime) modalTime.textContent = recipe.time;
      if (modalSpice) modalSpice.textContent = recipe.spice;
      if (modalServings) modalServings.textContent = recipe.servings;
      if (modalDesc) modalDesc.textContent = recipe.description;

      if (modalIngredients) {
        modalIngredients.innerHTML = recipe.ingredients
          .map(ing => `<li style="margin-bottom: 6px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--color-gold-500);">•</span> ${ing}</li>`)
          .join("");
      }

      if (modalSteps) {
        modalSteps.innerHTML = recipe.steps
          .map((st, i) => `<li style="margin-bottom: 12px; line-height: 1.6;"><strong style="color: var(--color-maroon-700);">Step ${i + 1}:</strong> ${st}</li>`)
          .join("");
      }

      if (modalChefTip) modalChefTip.textContent = recipe.chefTip;

      openModal(recipeModal);
    });
  });

  // ==========================================
  // Regional Recipe Filtering Tabs
  // ==========================================
  const recipeFilterBtns = document.querySelectorAll(".recipe-filter-btn");
  const recipeCards = document.querySelectorAll(".recipe-card");

  if (recipeFilterBtns.length > 0 && recipeCards.length > 0) {
    recipeFilterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        recipeFilterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        recipeCards.forEach(card => {
          const region = card.getAttribute("data-region");
          if (filter === "all" || region === filter) {
            card.classList.remove("is-hidden");
            card.classList.add("is-revealed");
          } else {
            card.classList.add("is-hidden");
          }
        });
      });
    });
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal-overlay");
      closeModal(modal);
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener("click", e => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      modalOverlays.forEach(m => closeModal(m));
      closeCart();
    }
  });

  // ==========================================
  // FAQ Accordion
  // ==========================================
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question-btn");
    const answer = item.querySelector(".faq-answer");

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach(other => {
        other.classList.remove("active");
        const otherAnswer = other.querySelector(".faq-answer");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    firstItem.classList.add("active");
    const firstAnswer = firstItem.querySelector(".faq-answer");
    if (firstAnswer) firstAnswer.style.maxHeight = firstAnswer.scrollHeight + "px";
  }

  // ==========================================
  // Toast Notification System
  // ==========================================
  const toastContainer = document.getElementById("toast-container");

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-gold-400); flex-shrink: 0;">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 14 14"/>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.35s ease";
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  // ==========================================
  // Social Proof Purchase Banner (Custom Illustrated Cart Card)
  // ==========================================
  const socialToast = document.getElementById("social-proof-toast");
  const socialCloseBtn = document.getElementById("social-proof-close-btn");

  let socialHovered = false;
  let socialDismissed = false;
  let socialHideTimeout = null;
  let socialFlickerTimeout = null;

  if (socialCloseBtn && socialToast) {
    socialCloseBtn.addEventListener("click", () => {
      socialDismissed = true;
      clearTimeout(socialFlickerTimeout);
      clearTimeout(socialHideTimeout);
      socialToast.classList.remove("show", "flicker", "hiding");
    });
  }

  if (socialToast) {
    socialToast.addEventListener("mouseenter", () => {
      socialHovered = true;
    });
    socialToast.addEventListener("mouseleave", () => {
      socialHovered = false;
    });
  }

  const buyers = [
    { name: "Riya Sharma", city: "Kolkata", qty: "2 Litres", time: "5 minutes ago" },
    { name: "Rajeshwar Rao", city: "Hyderabad", qty: "3 Litres", time: "12 minutes ago" },
    { name: "Meenakshi Devi", city: "Patna", qty: "1 Litre", time: "18 minutes ago" },
    { name: "Sunil Grover", city: "New Delhi", qty: "4 Litres", time: "25 minutes ago" },
    { name: "Ananya Sen", city: "Siliguri", qty: "2 Litres", time: "31 minutes ago" },
    { name: "Vikram Malhotra", city: "Chandigarh", qty: "5 Litres", time: "38 minutes ago" },
    { name: "Pooja Banerjee", city: "Bengaluru", qty: "2 Litres", time: "44 minutes ago" }
  ];

  let buyerIdx = 0;
  function triggerSocialProof() {
    if (!socialToast || socialDismissed || window.innerWidth <= 768) return;
    const buyer = buyers[buyerIdx];
    buyerIdx = (buyerIdx + 1) % buyers.length;

    const buyerNameEl = document.getElementById("social-buyer-name");
    const buyerCityEl = document.getElementById("social-buyer-city");
    const buyerQtyEl = document.getElementById("social-buyer-qty");
    const buyerTimeEl = document.getElementById("social-buyer-time");

    if (buyerNameEl) buyerNameEl.textContent = buyer.name;
    if (buyerCityEl) buyerCityEl.textContent = `(${buyer.city})`;
    if (buyerQtyEl) buyerQtyEl.textContent = buyer.qty;
    if (buyerTimeEl) buyerTimeEl.textContent = buyer.time;

    // Reset previous classes
    socialToast.classList.remove("flicker", "hiding");
    socialToast.classList.add("show");

    // 1. After appearing and remaining visible for 3.2s, start smooth flicker
    clearTimeout(socialFlickerTimeout);
    socialFlickerTimeout = setTimeout(() => {
      if (!socialToast.classList.contains("show") || socialDismissed) return;
      socialToast.classList.add("flicker");
    }, 3200);

    // 2. After flickering smoothly (1.5s), smoothly disappear
    clearTimeout(socialHideTimeout);
    socialHideTimeout = setTimeout(() => {
      if (!socialToast.classList.contains("show") || socialDismissed) return;

      const proceedHide = () => {
        socialToast.classList.add("hiding");
        setTimeout(() => {
          socialToast.classList.remove("show", "flicker", "hiding");
        }, 700);
      };

      if (socialHovered) {
        const onMouseLeave = () => {
          socialToast.removeEventListener("mouseleave", onMouseLeave);
          proceedHide();
        };
        socialToast.addEventListener("mouseleave", onMouseLeave);
      } else {
        proceedHide();
      }
    }, 4800);
  }

  setTimeout(triggerSocialProof, 3500);
  setInterval(triggerSocialProof, 17000);

  // Newsletter
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", e => {
      e.preventDefault();
      const input = newsletterForm.querySelector("input[type='email']");
      if (input && input.value) {
        showToast("Welcome to the Shrestham Family! 15% discount coupon sent to your email 📩");
        input.value = "";
      }
    });
  }

  // Mobile Menu
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", e => {
      e.stopPropagation();
      const isActive = navLinks.classList.toggle("active");
      mobileMenuToggle.textContent = isActive ? "✕" : "☰";
      mobileMenuToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
    });

    // Close mobile menu on clicking any navigation link
    navLinks.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        if (mobileMenuToggle) {
          mobileMenuToggle.textContent = "☰";
          mobileMenuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", e => {
      if (navLinks.classList.contains("active") && !navLinks.contains(e.target) && e.target !== mobileMenuToggle) {
        navLinks.classList.remove("active");
        if (mobileMenuToggle) {
          mobileMenuToggle.textContent = "☰";
          mobileMenuToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  // ==========================================
  // Comprehensive Full-Website Scroll Reveal Engine
  // Applies scroll reveal animations to all texts, cards, and images
  // ==========================================
  function initScrollReveal() {
    const EXCLUDED_SELECTORS = [
      "#recipe-modal", "#lab-cert-modal", "#process-modal", "#admin-portal-modal",
      ".modal-overlay", ".modal-box", ".cart-drawer", ".cart-drawer-backdrop",
      ".product-pop-bottle", "#social-proof-toast", ".announcement-bar", 
      ".site-header", ".sticky-mobile-bar", "#toast-container"
    ];

    function isExcluded(el) {
      if (!el || !(el instanceof HTMLElement)) return true;
      if (el.classList.contains("product-pop-bottle") || el.id === "main-product-img") return true;
      for (const sel of EXCLUDED_SELECTORS) {
        if (el.matches(sel) || el.closest(sel)) return true;
      }
      return false;
    }

    // 1. Text elements: Section labels, headings, subtitles, descriptions, paragraphs, buttons
    const textSelectors = [
      ".section-label",
      ".section-title",
      ".section-subtitle",
      ".hero-eyebrow",
      ".hero-title",
      ".hero-desc",
      ".hero-cta-group",
      ".hero-social-proof",
      ".heritage-eyebrow",
      ".heritage-title",
      ".heritage-desc",
      ".heritage-content .btn",
      ".process-header > *",
      ".product-info-side > .product-rating-wrap",
      ".product-info-side > .product-name",
      ".product-info-side > .product-subtitle",
      ".product-info-side > .product-desc",
      ".nutrition-showcase > h3",
      ".nutrition-showcase > .nutrition-subtitle",
      ".nutrition-table",
      ".ingredients-callout",
      ".subscription-form-side > h3",
      ".subscription-form-side > p",
      ".sub-summary-header",
      ".newsletter-card > h3",
      ".newsletter-card > p",
      ".newsletter-form",
      ".newsletter-note",
      ".recipes-filter-bar",
      ".footer-brand > p",
      ".footer-col > h5",
      ".footer-links-list",
      ".footer-contact-info",
      ".footer-bottom"
    ];

    textSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.hasAttribute("data-reveal") && !isExcluded(el)) {
          el.setAttribute("data-reveal", "up");
        }
      });
    });

    // 2. Card elements across all sections
    const cardSelectors = [
      ".pillar-item",
      ".step-card",
      ".product-stage-card",
      ".single-product-pricing-card",
      ".purchase-action-row",
      ".sub-discount-callout",
      ".sub-pricing-calculator-card",
      ".subscription-form-side",
      ".subscription-summary-side",
      ".lab-cert-showcase",
      ".nutrition-showcase",
      ".comparison-table-wrap",
      ".benefit-card",
      ".recipe-card",
      ".testimonial-card",
      ".faq-item",
      ".newsletter-card",
      ".footer-col",
      ".footer-brand"
    ];

    cardSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.hasAttribute("data-reveal") && !isExcluded(el)) {
          el.setAttribute("data-reveal", "up");
        }
      });
    });

    // 3. Imagery and visual components
    const imageSelectors = [
      ".hero-stage-img",
      ".hero-visual-card",
      ".step-img-wrap",
      ".benefit-icon-badge",
      ".author-avatar",
      ".hero-feature-item",
      ".product-trust-perks > *",
      ".sub-perks-list > *",
      ".footer-fssai-box",
      ".cert-pass-badge",
      ".brand-logo-img",
      ".footer-logo-img"
    ];

    imageSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.hasAttribute("data-reveal") && !isExcluded(el)) {
          el.setAttribute("data-reveal", "scale");
        }
      });
    });

    // 4. Staggered reveal timing for grid child elements
    const gridContainers = [
      ".pillars-grid",
      ".process-steps-grid",
      ".benefits-grid",
      ".recipes-grid",
      ".testimonials-grid",
      ".hero-features-list",
      ".product-trust-perks",
      ".sub-perks-list",
      ".footer-top-grid",
      ".faq-accordion-wrap"
    ];

    gridContainers.forEach(containerSel => {
      document.querySelectorAll(containerSel).forEach(container => {
        const children = Array.from(container.children).filter(c => !isExcluded(c));
        children.forEach((child, index) => {
          if (!child.hasAttribute("data-reveal")) {
            child.setAttribute("data-reveal", "up");
          }
          const delay = Math.min(index * 90, 500);
          child.style.setProperty("--reveal-delay", `${delay}ms`);
        });
      });
    });

    // 5. Initial Hero Load Orchestration
    const heroElements = [
      { sel: ".hero-eyebrow", type: "up", delay: 100 },
      { sel: ".hero-title", type: "up", delay: 200 },
      { sel: ".hero-desc", type: "up", delay: 320 },
      { sel: ".hero-features-list", type: "up", delay: 440 },
      { sel: ".hero-cta-group", type: "up", delay: 560 },
      { sel: ".hero-social-proof", type: "up", delay: 680 },
      { sel: ".hero-visual-card", type: "scale", delay: 350 }
    ];

    heroElements.forEach(item => {
      const el = document.querySelector(item.sel);
      if (el) {
        el.setAttribute("data-reveal", item.type);
        el.style.setProperty("--reveal-delay", `${item.delay}ms`);
      }
    });

    // 6. Setup IntersectionObserver
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    // Observe all [data-reveal] elements
    const allRevealElements = document.querySelectorAll("[data-reveal]");
    allRevealElements.forEach(el => {
      if (!isExcluded(el)) {
        const rect = el.getBoundingClientRect();
        // If element is already in the viewport upon load, reveal smoothly
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setTimeout(() => {
            el.classList.add("is-revealed");
          }, 50);
        } else {
          revealObserver.observe(el);
        }
      }
    });
  }

  // Initial runs
  updateProductView();
  renderCart();
  updateSubscriptionCalculator();
  initScrollReveal();
});

