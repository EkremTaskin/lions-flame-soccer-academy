import jerseyImg from '../assets/shop/jersey.png';
import capImg from '../assets/shop/cap.png';
import bottleImg from '../assets/shop/bottle.png';
import keychainImg from '../assets/shop/keychain.png';

export const productsData = [
    {
        id: 1,
        name: "Lions Academy Pro Jersey",
        price: 45.00,
        originalPrice: 55.00,
        image: jerseyImg,
        badge: "PRE-ORDER NOW!",
        category: "Apparel",
        description: "The long-awaited academy training jersey. Professional fit, breathable fabric, and elite performance gear for every player.",
        details: [
            "Logo: Heat Pressed",
            "Colors: Black and Gold",
            "Sizes: XS, S, M, L, XL",
            "Material: 100% Breathable Polyester",
            "Functional Material, designed for athletic excellence."
        ]
    },
    {
        id: 2,
        name: "Lions Academy Trucker Hat",
        price: 25.00,
        originalPrice: 35.00,
        image: capImg,
        badge: "PRE-ORDER NOW!",
        category: "Accessories",
        description: "Official academy cap with premium embroidered branding. Perfect for off-the-field style and shielding from the sun.",
        details: [
            "Logo: Embroidered Stitch",
            "Colors: Black/Gold",
            "Sizes: Adjustable One-Size",
            "Material: Cotton/Mesh back",
            "Reinforced stitching for durability."
        ]
    },
    {
        id: 3,
        name: "24oz Double Wall Water Bottle",
        price: 30.00,
        originalPrice: 40.00,
        image: bottleImg,
        badge: "NEW ARRIVAL",
        category: "Equipment",
        description: "Keep your water ice-cold for 24 hours with this sleek, vacuum-insulated academy bottle.",
        details: [
            "Logo: Laser Engraved",
            "Colors: Matte Black",
            "Sizes: 24oz (710ml)",
            "Material: Non-Toxic Stainless Steel",
            "Double-wall insulation, condensation-free."
        ]
    },
    {
        id: 4,
        name: "Official Academy Keychain",
        price: 12.00,
        originalPrice: 15.00,
        image: keychainImg,
        badge: "BEST SELLER",
        category: "Accessories",
        description: "Carry the academy pride everywhere you go with this premium metal and leather keychain.",
        details: [
            "Logo: Laser Etched",
            "Colors: Gold/Black",
            "Sizes: Universal",
            "Material: Metal and Leather",
            "High-quality hardware for key security."
        ]
    }
];
