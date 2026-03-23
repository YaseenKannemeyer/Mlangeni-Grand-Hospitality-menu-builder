import { useState, useReducer, createContext, useContext } from "react";

// ─────────────────────────────────────────────
// DATA — real Unsplash food images per dish
// ─────────────────────────────────────────────
const MENU_DATA = {
  starters: [
    {
      id: "s1",
      name: "Bruschetta Trio",
      description:
        "Toasted sourdough with heirloom tomato, whipped ricotta & roasted pepper",
      image:
        "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&auto=format&fit=crop&q=80",
      tags: ["vegetarian"],
    },
    {
      id: "s2",
      name: "Smoked Salmon Blinis",
      description:
        "House-cured salmon on buckwheat blinis with crème fraîche & dill",
      image:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80",
      tags: [],
    },
    {
      id: "s3",
      name: "Caprese Skewers",
      description:
        "Buffalo mozzarella, heirloom tomato & fresh basil with aged balsamic",
      image:
        "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&auto=format&fit=crop&q=80",
      tags: ["vegetarian", "gluten-free"],
    },
    {
      id: "s4",
      name: "Chicken Satay",
      description:
        "Grilled skewers with peanut sauce, cucumber & pickled shallots",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
      tags: ["gluten-free"],
    },
    {
      id: "s5",
      name: "Arancini",
      description:
        "Crisp saffron risotto balls filled with wild mushroom & truffle oil",
      image:
        "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=600&auto=format&fit=crop&q=80",
      tags: ["vegetarian"],
    },
    {
      id: "s6",
      name: "Charcuterie Board",
      description:
        "Cured meats, artisan cheeses, cornichons & seasonal preserves",
      image:
        "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&auto=format&fit=crop&q=80",
      tags: [],
    },
  ],
  mains: [
    {
      id: "m1",
      name: "Slow-Roast Beef Fillet",
      description:
        "Prime beef with truffle jus, confit garlic pomme purée & haricots verts",
      image:
        "https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80",
      tags: ["gluten-free"],
    },
    {
      id: "m2",
      name: "Pan-Seared Salmon",
      description:
        "Atlantic salmon with lemon beurre blanc, asparagus & new potatoes",
      image:
        "https://images.unsplash.com/photo-1485921325833-c519793a4833?w=600&auto=format&fit=crop&q=80",
      tags: ["gluten-free"],
    },
    {
      id: "m3",
      name: "Wild Mushroom Risotto",
      description:
        "Carnaroli rice with porcini, truffle oil, aged parmesan & fresh herbs",
      image:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop&q=80",
      tags: ["vegetarian", "gluten-free"],
    },
    {
      id: "m4",
      name: "Herb-Crusted Rack of Lamb",
      description:
        "New Zealand lamb with rosemary jus, dauphinoise & seasonal greens",
      image:
        "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&auto=format&fit=crop&q=80",
      tags: ["gluten-free"],
    },
    {
      id: "m5",
      name: "Chicken Supreme",
      description:
        "Free-range chicken with tarragon cream, pommes Anna & broccolini",
      image:
        "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=600&auto=format&fit=crop&q=80",
      tags: ["gluten-free"],
    },
    {
      id: "m6",
      name: "Butternut Squash Wellington",
      description:
        "Seasonal vegetables in golden puff pastry with red wine reduction",
      image:
        "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&auto=format&fit=crop&q=80",
      tags: ["vegan"],
    },
  ],
  desserts: [
    {
      id: "d1",
      name: "Dark Chocolate Fondant",
      description:
        "Warm Belgian chocolate centre with Madagascan vanilla ice cream",
      image:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
      tags: ["vegetarian"],
    },
    {
      id: "d2",
      name: "Lemon Posset",
      description:
        "Silky set lemon cream with fresh raspberries & tuile biscuit",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
      tags: ["vegetarian"],
    },
    {
      id: "d3",
      name: "Tiramisu",
      description:
        "Classic espresso & mascarpone with cocoa dusting & Savoiardi",
      image:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80",
      tags: ["vegetarian"],
    },
    {
      id: "d4",
      name: "Seasonal Fruit Pavlova",
      description:
        "Crisp meringue with chantilly cream & fresh seasonal fruits",
      image:
        "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600&auto=format&fit=crop&q=80",
      tags: ["vegetarian", "gluten-free"],
    },
    {
      id: "d5",
      name: "Cheese Trolley",
      description: "Five artisan cheeses with quince jelly, walnuts & crackers",
      image:
        "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&auto=format&fit=crop&q=80",
      tags: ["vegetarian"],
    },
  ],
  beverages: {
    alcoholic: [
      {
        id: "b1",
        name: "House Wine Package",
        description: "Curated red, white & rosé wines throughout the meal",
        image:
          "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
        tags: [],
      },
      {
        id: "b2",
        name: "Champagne Reception",
        description: "Moët & Chandon on arrival with canapé service",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
        tags: [],
      },
      {
        id: "b3",
        name: "Craft Beer Selection",
        description: "Local craft lagers, ales & IPAs from our curated range",
        image:
          "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop&q=80",
        tags: [],
      },
    ],
    non_alcoholic: [
      {
        id: "b4",
        name: "Premium Soft Drinks",
        description:
          "Sparkling & still water, juices, sodas & artisan lemonades",
        image:
          "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80",
        tags: [],
      },
      {
        id: "b5",
        name: "Specialty Coffee Station",
        description:
          "Barista-served espresso, cappuccino & filter with pastries",
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
        tags: [],
      },
      {
        id: "b6",
        name: "Mocktail Bar",
        description:
          "Handcrafted alcohol-free cocktails with fresh herbs & botanicals",
        image:
          "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80",
        tags: [],
      },
    ],
  },
};

const TAG_COLORS = {
  vegetarian: { bg: "#e8f5e9", text: "#2e7d32" },
  vegan: { bg: "#e0f2f1", text: "#00695c" },
  "gluten-free": { bg: "#fff3e0", text: "#e65100" },
};

const STEPS = [
  "Starters",
  "Mains",
  "Desserts",
  "Beverages",
  "Event Details",
  "Your Quote",
];

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
const initialState = {
  step: 0,
  selections: { starters: [], mains: [], desserts: [], beverages: [] },
  beverageChoice: null,
  beverageTypeChoice: null,
  guests: "",
  eventDate: "",
  notes: "",
  quoteSent: false,
  contactName: "",
  contactEmail: "",
  contactPhone: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, STEPS.length - 1) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 0) };
    case "GO_TO_STEP":
      return { ...state, step: action.payload };
    case "ADD_ITEM": {
      const cat = action.payload.category;
      if (state.selections[cat].find((i) => i.id === action.payload.item.id))
        return state;
      return {
        ...state,
        selections: {
          ...state.selections,
          [cat]: [...state.selections[cat], action.payload.item],
        },
      };
    }
    case "REMOVE_ITEM": {
      const cat = action.payload.category;
      return {
        ...state,
        selections: {
          ...state.selections,
          [cat]: state.selections[cat].filter(
            (i) => i.id !== action.payload.id,
          ),
        },
      };
    }
    case "SET_BEVERAGE_CHOICE":
      return {
        ...state,
        beverageChoice: action.payload,
        beverageTypeChoice: null,
      };
    case "SET_BEVERAGE_TYPE":
      return { ...state, beverageTypeChoice: action.payload };
    case "SET_GUESTS":
      return { ...state, guests: action.payload };
    case "SET_DATE":
      return { ...state, eventDate: action.payload };
    case "SET_NOTES":
      return { ...state, notes: action.payload };
    case "SET_CONTACT":
      return { ...state, [action.field]: action.payload };
    case "SEND_QUOTE":
      return { ...state, quoteSent: true };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

const MenuCtx = createContext(null);
const useMenu = () => useContext(MenuCtx);

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .mb-root { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #faf9f6; color: #1a1a1a; }

  .mb-header { background: #1a1a1a; color: #f5f0e8; padding: 1.4rem 2rem; display: flex; align-items: center; justify-content: space-between; }
  .mb-wordmark { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; letter-spacing: 0.05em; color: #c9a96e; }
  .mb-header-sub { font-size: 0.72rem; color: #a0998a; letter-spacing: 0.12em; text-transform: uppercase; }

  .mb-progress { background: #1a1a1a; padding: 0 2rem 1.4rem; display: flex; align-items: center; overflow-x: auto; }
  .mb-step-pill { display: flex; align-items: center; gap: 8px; padding: 6px 14px 6px 10px; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: #555; white-space: nowrap; transition: color 0.3s; cursor: default; }
  .mb-step-pill.active { color: #c9a96e; }
  .mb-step-pill.done { color: #888; cursor: pointer; }
  .mb-step-pill.done:hover { color: #c9a96e; }
  .mb-step-num { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 600; background: #2a2a2a; color: #555; flex-shrink: 0; transition: all 0.3s; }
  .mb-step-pill.active .mb-step-num { background: #c9a96e; color: #1a1a1a; }
  .mb-step-pill.done .mb-step-num { background: #3d4a3d; color: #8bc48b; }
  .mb-step-arrow { color: #333; font-size: 0.8rem; }

  .mb-body { display: flex; min-height: calc(100vh - 115px); }
  .mb-main { flex: 1; padding: 2.5rem 2rem; max-width: 900px; }
  .mb-cart-sidebar { width: 295px; flex-shrink: 0; background: #fff; border-left: 1px solid #ece8e0; padding: 1.4rem; position: sticky; top: 0; height: calc(100vh - 115px); overflow-y: auto; }

  .mb-step-title { font-family: 'Cormorant Garamond', serif; font-size: 2.1rem; font-weight: 600; color: #1a1a1a; margin-bottom: 0.3rem; letter-spacing: -0.01em; }
  .mb-step-sub { font-size: 0.83rem; color: #888; margin-bottom: 2rem; font-weight: 300; }
  .mb-section-label { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #c9a96e; margin-bottom: 1rem; }

  .mb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }

  .mb-card { background: #fff; border: 1px solid #ece8e0; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s; animation: cardIn 0.35s ease both; }
  .mb-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); border-color: #d5ccba; }

  @keyframes cardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .mb-card-img { width: 100%; height: 155px; object-fit: cover; display: block; background: #f0ece4; }
  .mb-img-skeleton { width: 100%; height: 155px; background: linear-gradient(90deg, #f0ece4 25%, #ece8e0 50%, #f0ece4 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }

  .mb-card-body { padding: 1rem 1.1rem 1.2rem; display: flex; flex-direction: column; gap: 0.45rem; flex: 1; }
  .mb-card-name { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 600; color: #1a1a1a; line-height: 1.25; }
  .mb-card-desc { font-size: 0.74rem; color: #888; line-height: 1.55; font-weight: 300; flex: 1; }
  .mb-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; gap: 8px; }

  .mb-tags { display: flex; gap: 4px; flex-wrap: wrap; flex: 1; }
  .mb-tag { font-size: 0.59rem; padding: 2px 7px; border-radius: 4px; font-weight: 500; letter-spacing: 0.04em; white-space: nowrap; }

  .mb-add-btn { background: #1a1a1a; color: #f5f0e8; border: none; border-radius: 8px; padding: 7px 15px; font-size: 0.73rem; font-weight: 500; cursor: pointer; letter-spacing: 0.04em; transition: background 0.2s, transform 0.1s; font-family: 'DM Sans', sans-serif; flex-shrink: 0; white-space: nowrap; }
  .mb-add-btn:hover { background: #c9a96e; color: #1a1a1a; }
  .mb-add-btn:active { transform: scale(0.97); }

  .mb-selected-strip { background: #f5f0e8; border: 1px solid #ece8e0; border-radius: 10px; padding: 0.7rem 1.1rem; margin-bottom: 1.5rem; }
  .mb-selected-item { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #ece8e0; font-size: 0.82rem; animation: slideIn 0.25s ease; }
  .mb-selected-item:last-child { border-bottom: none; }
  .mb-sel-thumb { width: 36px; height: 36px; border-radius: 6px; object-fit: cover; flex-shrink: 0; background: #ece8e0; }
  .mb-remove-btn { background: none; border: none; color: #bbb; cursor: pointer; font-size: 1.1rem; padding: 2px 6px; border-radius: 4px; transition: color 0.2s, background 0.2s; flex-shrink: 0; margin-left: auto; line-height: 1; }
  .mb-remove-btn:hover { color: #c0392b; background: #fdf0f0; }

  .mb-nav { display: flex; align-items: center; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
  .mb-btn-primary { background: #1a1a1a; color: #f5f0e8; border: none; border-radius: 10px; padding: 12px 28px; font-size: 0.83rem; font-weight: 500; cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .mb-btn-primary:hover { background: #c9a96e; color: #1a1a1a; transform: translateY(-1px); }
  .mb-btn-primary:disabled { background: #ccc; color: #888; cursor: not-allowed; transform: none; }
  .mb-btn-secondary { background: transparent; color: #888; border: 1px solid #ddd; border-radius: 10px; padding: 12px 20px; font-size: 0.83rem; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; letter-spacing: 0.04em; }
  .mb-btn-secondary:hover { border-color: #888; color: #1a1a1a; }
  .mb-btn-gold { background: #c9a96e; color: #fff; border: none; border-radius: 10px; padding: 13px 28px; font-size: 0.83rem; font-weight: 500; cursor: pointer; letter-spacing: 0.07em; text-transform: uppercase; transition: all 0.2s; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 16px rgba(201,169,110,0.3); }
  .mb-btn-gold:hover { background: #b8894a; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,169,110,0.4); }

  .mb-choice-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .mb-choice-card { flex: 1; min-width: 130px; border: 2px solid #ece8e0; border-radius: 12px; padding: 1.3rem 1rem; cursor: pointer; text-align: center; transition: all 0.2s; background: #fff; }
  .mb-choice-card:hover { border-color: #c9a96e; transform: translateY(-2px); }
  .mb-choice-card.selected { border-color: #1a1a1a; background: #1a1a1a; color: #f5f0e8; }
  .mb-choice-label { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 600; display: block; margin-bottom: 4px; }
  .mb-choice-sub { font-size: 0.69rem; color: #aaa; font-weight: 300; display: block; }
  .mb-choice-card.selected .mb-choice-sub { color: #c9a96e; }

  .mb-form { display: flex; flex-direction: column; gap: 1.2rem; max-width: 480px; }
  .mb-label { font-size: 0.7rem; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: #888; margin-bottom: 6px; display: block; }
  .mb-input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 11px 14px; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; color: #1a1a1a; background: #fff; transition: border-color 0.2s; outline: none; }
  .mb-input:focus { border-color: #c9a96e; }
  .mb-input.error { border-color: #e74c3c; }
  .mb-textarea { resize: vertical; min-height: 80px; }
  .mb-error-msg { font-size: 0.71rem; color: #e74c3c; margin-top: 4px; }

  .mb-alert { background: #fef9f0; border: 1px solid #f0d090; border-radius: 8px; padding: 10px 14px; font-size: 0.77rem; color: #8a6020; margin-bottom: 1rem; }

  .cart-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: #1a1a1a; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #ece8e0; }
  .cart-empty { font-size: 0.76rem; color: #bbb; text-align: center; padding: 2rem 0; font-weight: 300; line-height: 1.6; }
  .cart-cat-label { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #c9a96e; margin-top: 1rem; margin-bottom: 0.4rem; }
  .cart-item { display: flex; align-items: center; gap: 8px; padding: 5px 0; font-size: 0.76rem; border-bottom: 1px dashed #f0ece4; }
  .cart-thumb { width: 30px; height: 30px; border-radius: 5px; object-fit: cover; flex-shrink: 0; background: #f0ece4; }
  .cart-item-name { color: #444; flex: 1; line-height: 1.3; }
  .cart-notice { background: #f5f0e8; border-radius: 8px; padding: 10px 12px; font-size: 0.72rem; color: #8a7050; margin-top: 1rem; line-height: 1.55; }
  .cart-meta { font-size: 0.67rem; color: #bbb; margin-top: 0.75rem; line-height: 1.5; }

  .quote-event-details { background: #f5f0e8; border-radius: 10px; padding: 1rem 1.2rem; margin-bottom: 1.4rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
  .qed-label { font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: #aaa; font-weight: 500; margin-bottom: 2px; }
  .qed-val { color: #1a1a1a; font-weight: 500; font-size: 0.84rem; }

  .quote-notice-block { background: #faf9f6; border: 1px solid #ece8e0; border-radius: 12px; padding: 1.1rem 1.3rem; margin-bottom: 1.4rem; display: flex; align-items: flex-start; gap: 12px; }
  .quote-notice-icon { width: 32px; height: 32px; border-radius: 50%; background: #c9a96e; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; flex-shrink: 0; }
  .quote-notice-text { font-size: 0.8rem; color: #666; line-height: 1.6; }
  .quote-notice-text strong { color: #1a1a1a; font-weight: 500; }

  .quote-block { background: #fff; border: 1px solid #ece8e0; border-radius: 12px; overflow: hidden; margin-bottom: 1rem; }
  .quote-block-header { background: #1a1a1a; color: #c9a96e; padding: 0.7rem 1.1rem; font-size: 0.66rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
  .quote-block-body { padding: 0.7rem 1.1rem; }
  .quote-item-row { display: flex; align-items: center; padding: 6px 0; font-size: 0.81rem; border-bottom: 1px dashed #f0ece4; gap: 10px; }
  .quote-item-row:last-child { border-bottom: none; }
  .quote-thumb { width: 36px; height: 36px; border-radius: 6px; object-fit: cover; flex-shrink: 0; background: #f0ece4; }
  .quote-item-name { color: #333; flex: 1; }

  .send-form { background: #fff; border: 1px solid #ece8e0; border-radius: 12px; padding: 1.4rem; margin-bottom: 1.5rem; }
  .send-form-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: #1a1a1a; }

  .mb-sending { opacity: 0.6; pointer-events: none; }
  .mb-send-error { background: #fdf0f0; border: 1px solid #f5c6c6; border-radius: 8px; padding: 10px 14px; font-size: 0.77rem; color: #c0392b; margin-bottom: 1rem; }

  .success-screen { text-align: center; padding: 4rem 2rem; animation: cardIn 0.5s ease; }
  .success-check { width: 62px; height: 62px; border-radius: 50%; background: #3d4a3d; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.5rem; color: #8bc48b; }
  .success-title { font-family: 'Cormorant Garamond', serif; font-size: 2.3rem; font-weight: 600; color: #1a1a1a; margin-bottom: 0.6rem; }
  .success-sub { font-size: 0.86rem; color: #888; font-weight: 300; max-width: 400px; margin: 0 auto 2rem; line-height: 1.75; }

  @media (max-width: 768px) {
    .mb-body { flex-direction: column; }
    .mb-cart-sidebar { width: 100%; height: auto; position: relative; border-left: none; border-top: 1px solid #ece8e0; }
    .mb-main { padding: 1.5rem 1rem; }
    .mb-progress { padding: 0 1rem 1rem; }
    .mb-header { padding: 1rem; }
    .mb-grid { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); }
  }
`;

// ─────────────────────────────────────────────
// FOOD IMAGE with skeleton loader
// ─────────────────────────────────────────────
function FoodImage({ src, alt, imgClass, skeletonClass }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  return (
    <>
      {!loaded && !errored && (
        <div className={skeletonClass || "mb-img-skeleton"} />
      )}
      {!errored && (
        <img
          src={src}
          alt={alt}
          className={imgClass}
          style={{ display: loaded ? "block" : "none" }}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
      {errored && (
        <div
          className={skeletonClass || "mb-img-skeleton"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "0.65rem", color: "#bbb" }}>No image</span>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// CART SIDEBAR
// ─────────────────────────────────────────────
function CartSidebar() {
  const { state } = useMenu();
  const cats = [
    { label: "Starters", items: state.selections.starters },
    { label: "Mains", items: state.selections.mains },
    { label: "Desserts", items: state.selections.desserts },
    { label: "Beverages", items: state.selections.beverages },
  ];
  const hasItems = cats.some((c) => c.items.length > 0);
  const totalItems = cats.reduce((s, c) => s + c.items.length, 0);

  return (
    <div className="mb-cart-sidebar">
      <div className="cart-title">
        Your Menu{" "}
        {hasItems && (
          <span
            style={{ fontSize: "0.72rem", color: "#c9a96e", fontWeight: 400 }}
          >
            ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </span>
        )}
      </div>
      {!hasItems && (
        <div className="cart-empty">
          No items selected yet — add dishes to see your menu build up here.
        </div>
      )}
      {cats.map(
        (cat) =>
          cat.items.length > 0 && (
            <div key={cat.label}>
              <div className="cart-cat-label">{cat.label}</div>
              {cat.items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-thumb"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <span className="cart-item-name">{item.name}</span>
                </div>
              ))}
            </div>
          ),
      )}
      {hasItems && (
        <div className="cart-notice">
          Our team will prepare a full itemised price quote based on your
          selections and guest count.
        </div>
      )}
      {state.guests && (
        <div className="cart-meta">
          {state.guests} guests
          {state.eventDate &&
            ` · ${new Date(state.eventDate + "T12:00:00").toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}`}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MENU STEP — reusable
// ─────────────────────────────────────────────
function MenuStep({ category, title, subtitle, items }) {
  const { state, dispatch } = useMenu();
  const selected = state.selections[category];
  const selectedIds = new Set(selected.map((i) => i.id));
  const available = items.filter((i) => !selectedIds.has(i.id));

  return (
    <div>
      <div className="mb-step-title">{title}</div>
      <div className="mb-step-sub">{subtitle}</div>

      {selected.length > 0 && (
        <>
          <div className="mb-section-label">Selected</div>
          <div className="mb-selected-strip">
            {selected.map((item) => (
              <div className="mb-selected-item" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="mb-sel-thumb"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <span style={{ flex: 1 }}>{item.name}</span>
                <button
                  className="mb-remove-btn"
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_ITEM",
                      payload: { category, id: item.id },
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {available.length > 0 && (
        <>
          <div className="mb-section-label">
            {selected.length > 0 ? "Add Another" : "Choose Your Options"}
          </div>
          <div className="mb-grid">
            {available.map((item, i) => (
              <div
                className="mb-card"
                key={item.id}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <FoodImage
                  src={item.image}
                  alt={item.name}
                  imgClass="mb-card-img"
                />
                <div className="mb-card-body">
                  <div className="mb-card-name">{item.name}</div>
                  <div className="mb-card-desc">{item.description}</div>
                  <div className="mb-card-footer">
                    <div className="mb-tags">
                      {item.tags.map((t) => (
                        <span
                          className="mb-tag"
                          key={t}
                          style={TAG_COLORS[t] || {}}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <button
                      className="mb-add-btn"
                      onClick={() =>
                        dispatch({
                          type: "ADD_ITEM",
                          payload: { category, item },
                        })
                      }
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {available.length === 0 && selected.length > 0 && (
        <div className="mb-alert">
          All options selected — remove one above to swap it out.
        </div>
      )}

      <div className="mb-nav">
        {state.step > 0 && (
          <button
            className="mb-btn-secondary"
            onClick={() => dispatch({ type: "PREV_STEP" })}
          >
            ← Back
          </button>
        )}
        <button
          className="mb-btn-primary"
          disabled={selected.length === 0}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
        >
          Next Step →
        </button>
        {selected.length === 0 && (
          <span style={{ fontSize: "0.71rem", color: "#bbb" }}>
            Select at least one option to continue
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BEVERAGE STEP
// ─────────────────────────────────────────────
function BeverageStep() {
  const { state, dispatch } = useMenu();

  const getBeverageItems = () => {
    if (state.beverageTypeChoice === "alcoholic")
      return MENU_DATA.beverages.alcoholic;
    if (state.beverageTypeChoice === "non_alcoholic")
      return MENU_DATA.beverages.non_alcoholic;
    if (state.beverageTypeChoice === "both")
      return [
        ...MENU_DATA.beverages.alcoholic,
        ...MENU_DATA.beverages.non_alcoholic,
      ];
    return [];
  };

  const selected = state.selections.beverages;
  const selectedIds = new Set(selected.map((i) => i.id));
  const available = getBeverageItems().filter((i) => !selectedIds.has(i.id));
  const canProceed =
    state.beverageChoice === "no" ||
    (state.beverageChoice === "yes" && selected.length > 0);

  return (
    <div>
      <div className="mb-step-title">Beverages</div>
      <div className="mb-step-sub">
        Complement your menu with the perfect drinks service
      </div>

      <div className="mb-section-label">
        Would you like to include beverages?
      </div>
      <div className="mb-choice-row">
        {[
          ["yes", "Yes, please", "Add drinks to my quote"],
          ["no", "No thanks", "Food only this time"],
        ].map(([val, label, sub]) => (
          <div
            key={val}
            className={`mb-choice-card ${state.beverageChoice === val ? "selected" : ""}`}
            onClick={() =>
              dispatch({ type: "SET_BEVERAGE_CHOICE", payload: val })
            }
          >
            <span className="mb-choice-label">{label}</span>
            <span className="mb-choice-sub">{sub}</span>
          </div>
        ))}
      </div>

      {state.beverageChoice === "yes" && (
        <div style={{ animation: "cardIn 0.3s ease" }}>
          <div className="mb-section-label" style={{ marginTop: "0.25rem" }}>
            Preference
          </div>
          <div className="mb-choice-row">
            {[
              ["alcoholic", "Alcoholic", "Wine, beer & spirits"],
              ["non_alcoholic", "Non-Alcoholic", "Juices, mocktails & coffee"],
              ["both", "Both", "Full drinks service"],
            ].map(([val, label, sub]) => (
              <div
                key={val}
                className={`mb-choice-card ${state.beverageTypeChoice === val ? "selected" : ""}`}
                onClick={() =>
                  dispatch({ type: "SET_BEVERAGE_TYPE", payload: val })
                }
              >
                <span className="mb-choice-label">{label}</span>
                <span className="mb-choice-sub">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.beverageChoice === "yes" && state.beverageTypeChoice && (
        <div style={{ animation: "cardIn 0.3s ease" }}>
          {selected.length > 0 && (
            <>
              <div className="mb-section-label">Selected Beverages</div>
              <div className="mb-selected-strip">
                {selected.map((item) => (
                  <div className="mb-selected-item" key={item.id}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="mb-sel-thumb"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span style={{ flex: 1 }}>{item.name}</span>
                    <button
                      className="mb-remove-btn"
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_ITEM",
                          payload: { category: "beverages", id: item.id },
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          {available.length > 0 && (
            <>
              <div className="mb-section-label">
                {selected.length > 0 ? "Add Another" : "Choose Beverages"}
              </div>
              <div className="mb-grid">
                {available.map((item, i) => (
                  <div
                    className="mb-card"
                    key={item.id}
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <FoodImage
                      src={item.image}
                      alt={item.name}
                      imgClass="mb-card-img"
                    />
                    <div className="mb-card-body">
                      <div className="mb-card-name">{item.name}</div>
                      <div className="mb-card-desc">{item.description}</div>
                      <div className="mb-card-footer">
                        <div />
                        <button
                          className="mb-add-btn"
                          onClick={() =>
                            dispatch({
                              type: "ADD_ITEM",
                              payload: { category: "beverages", item },
                            })
                          }
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="mb-nav">
        <button
          className="mb-btn-secondary"
          onClick={() => dispatch({ type: "PREV_STEP" })}
        >
          ← Back
        </button>
        <button
          className="mb-btn-primary"
          disabled={!canProceed}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
        >
          Next Step →
        </button>
        {!canProceed && (
          <span style={{ fontSize: "0.71rem", color: "#bbb" }}>
            Make a selection to continue
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EVENT DETAILS
// ─────────────────────────────────────────────
function EventDetailsStep() {
  const { state, dispatch } = useMenu();
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const e = {};
    if (!state.guests || parseInt(state.guests) < 1)
      e.guests = "Please enter a valid guest count";
    if (!state.eventDate) e.eventDate = "Please select an event date";
    else if (state.eventDate < today)
      e.eventDate = "Event date must be in the future";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    dispatch({ type: "NEXT_STEP" });
  };

  return (
    <div>
      <div className="mb-step-title">Event Details</div>
      <div className="mb-step-sub">
        Help us prepare your personalised quote with the key event information
      </div>
      <div className="mb-form">
        <div>
          <label className="mb-label">Number of Guests *</label>
          <input
            type="number"
            min="1"
            className={`mb-input ${errors.guests ? "error" : ""}`}
            placeholder="e.g. 80"
            value={state.guests}
            onChange={(e) => {
              dispatch({ type: "SET_GUESTS", payload: e.target.value });
              setErrors((p) => ({ ...p, guests: "" }));
            }}
          />
          {errors.guests && <div className="mb-error-msg">{errors.guests}</div>}
        </div>
        <div>
          <label className="mb-label">Event Date *</label>
          <input
            type="date"
            min={today}
            className={`mb-input ${errors.eventDate ? "error" : ""}`}
            value={state.eventDate}
            onChange={(e) => {
              dispatch({ type: "SET_DATE", payload: e.target.value });
              setErrors((p) => ({ ...p, eventDate: "" }));
            }}
          />
          {errors.eventDate && (
            <div className="mb-error-msg">{errors.eventDate}</div>
          )}
        </div>
        <div>
          <label className="mb-label">Additional Notes (optional)</label>
          <textarea
            className="mb-input mb-textarea"
            placeholder="Dietary requirements, venue details, theme, special requests..."
            value={state.notes}
            onChange={(e) =>
              dispatch({ type: "SET_NOTES", payload: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mb-nav">
        <button
          className="mb-btn-secondary"
          onClick={() => dispatch({ type: "PREV_STEP" })}
        >
          ← Back
        </button>
        <button className="mb-btn-primary" onClick={handleNext}>
          Review My Quote →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// QUOTE STEP
// ─────────────────────────────────────────────
function QuoteStep() {
  const { state, dispatch } = useMenu();
  const [showSend, setShowSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendErrors, setSendErrors] = useState({});

  const cats = [
    { label: "Starters", items: state.selections.starters },
    { label: "Main Courses", items: state.selections.mains },
    { label: "Desserts", items: state.selections.desserts },
    { label: "Beverages", items: state.selections.beverages },
  ].filter((c) => c.items.length > 0);

  const totalItems = cats.reduce((s, c) => s + c.items.length, 0);
  const g = parseInt(state.guests);

  const validateSend = () => {
    const e = {};
    if (!state.contactName.trim()) e.contactName = "Name is required";
    if (!state.contactEmail.trim() || !state.contactEmail.includes("@"))
      e.contactEmail = "Valid email required";
    return e;
  };

  const handleSend = async () => {
    const e = validateSend();
    if (Object.keys(e).length > 0) {
      setSendErrors(e);
      return;
    }

    setSending(true);
    setSendError("");

    try {
      const res = await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: state.contactName,
          contactEmail: state.contactEmail,
          contactPhone: state.contactPhone,
          guests: state.guests,
          eventDate: state.eventDate,
          notes: state.notes,
          selections: state.selections,
        }),
      });

      if (!res.ok) throw new Error("Server error");
      dispatch({ type: "SEND_QUOTE" });
    } catch (err) {
      setSendError(
        "Something went wrong sending your quote. Please try again or email us directly.",
      );
    } finally {
      setSending(false);
    }
  };

  if (state.quoteSent) {
    return (
      <div className="success-screen">
        <div className="success-check">✓</div>
        <div className="success-title">Quote Request Sent</div>
        <div className="success-sub">
          Thank you, {state.contactName}. Your menu request has been received.
          Our catering specialists will prepare a full price quote and be in
          touch within 24 hours.
        </div>
        <button
          className="mb-btn-gold"
          onClick={() => dispatch({ type: "RESET" })}
        >
          Build Another Menu
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-step-title">Your Menu Summary</div>
      <div className="mb-step-sub">
        Review your selections before submitting — edit anytime
      </div>

      <div className="quote-event-details">
        <div>
          <div className="qed-label">Guests</div>
          <div className="qed-val">{g} people</div>
        </div>
        <div>
          <div className="qed-label">Event Date</div>
          <div className="qed-val">
            {new Date(state.eventDate + "T12:00:00").toLocaleDateString(
              "en-ZA",
              { day: "numeric", month: "long", year: "numeric" },
            )}
          </div>
        </div>
        <div>
          <div className="qed-label">Courses</div>
          <div className="qed-val">
            {cats.length} courses, {totalItems} dishes
          </div>
        </div>
        {state.notes && (
          <div style={{ gridColumn: "1/-1" }}>
            <div className="qed-label">Notes</div>
            <div
              className="qed-val"
              style={{ fontWeight: 300, fontSize: "0.79rem" }}
            >
              {state.notes}
            </div>
          </div>
        )}
      </div>

      <div className="quote-notice-block">
        <div className="quote-notice-icon">i</div>
        <div className="quote-notice-text">
          <strong>Pricing will be provided by our team.</strong> Once you submit
          this request, our catering specialists will review your selections and
          send a full itemised quote tailored to your event.
        </div>
      </div>

      {cats.map((cat) => (
        <div className="quote-block" key={cat.label}>
          <div className="quote-block-header">{cat.label}</div>
          <div className="quote-block-body">
            {cat.items.map((item) => (
              <div className="quote-item-row" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="quote-thumb"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <span className="quote-item-name">{item.name}</span>
                {item.tags.length > 0 && (
                  <div className="mb-tags">
                    {item.tags.map((t) => (
                      <span
                        className="mb-tag"
                        key={t}
                        style={TAG_COLORS[t] || {}}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {!showSend ? (
        <div className="mb-nav">
          <button
            className="mb-btn-secondary"
            onClick={() => dispatch({ type: "PREV_STEP" })}
          >
            ← Edit Details
          </button>
          <button
            className="mb-btn-secondary"
            onClick={() => dispatch({ type: "GO_TO_STEP", payload: 0 })}
          >
            Edit Menu
          </button>
          <button className="mb-btn-gold" onClick={() => setShowSend(true)}>
            Request Price Quote →
          </button>
        </div>
      ) : (
        <div
          className={`send-form ${sending ? "mb-sending" : ""}`}
          style={{ animation: "cardIn 0.3s ease" }}
        >
          <div className="send-form-title">Your Contact Details</div>
          {sendError && <div className="mb-send-error">{sendError}</div>}
          <div className="mb-form">
            <div>
              <label className="mb-label">Your Name *</label>
              <input
                className={`mb-input ${sendErrors.contactName ? "error" : ""}`}
                placeholder="Full name"
                value={state.contactName}
                onChange={(e) => {
                  dispatch({
                    type: "SET_CONTACT",
                    field: "contactName",
                    payload: e.target.value,
                  });
                  setSendErrors((p) => ({ ...p, contactName: "" }));
                }}
              />
              {sendErrors.contactName && (
                <div className="mb-error-msg">{sendErrors.contactName}</div>
              )}
            </div>
            <div>
              <label className="mb-label">Email Address *</label>
              <input
                type="email"
                className={`mb-input ${sendErrors.contactEmail ? "error" : ""}`}
                placeholder="you@email.com"
                value={state.contactEmail}
                onChange={(e) => {
                  dispatch({
                    type: "SET_CONTACT",
                    field: "contactEmail",
                    payload: e.target.value,
                  });
                  setSendErrors((p) => ({ ...p, contactEmail: "" }));
                }}
              />
              {sendErrors.contactEmail && (
                <div className="mb-error-msg">{sendErrors.contactEmail}</div>
              )}
            </div>
            <div>
              <label className="mb-label">Phone Number (optional)</label>
              <input
                type="tel"
                className="mb-input"
                placeholder="+27 xx xxx xxxx"
                value={state.contactPhone}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CONTACT",
                    field: "contactPhone",
                    payload: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mb-nav" style={{ marginTop: "1.2rem" }}>
            <button
              className="mb-btn-secondary"
              onClick={() => setShowSend(false)}
              disabled={sending}
            >
              ← Back
            </button>
            <button
              className="mb-btn-gold"
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Quote Request →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────
function ProgressBar() {
  const { state, dispatch } = useMenu();
  return (
    <div className="mb-progress">
      {STEPS.map((label, i) => {
        const status =
          i < state.step ? "done" : i === state.step ? "active" : "";
        return (
          <div key={label} style={{ display: "flex", alignItems: "center" }}>
            <div
              className={`mb-step-pill ${status}`}
              onClick={() =>
                status === "done" &&
                dispatch({ type: "GO_TO_STEP", payload: i })
              }
            >
              <div className="mb-step-num">
                {status === "done" ? "✓" : i + 1}
              </div>
              {label}
            </div>
            {i < STEPS.length - 1 && <div className="mb-step-arrow">›</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP ROUTER
// ─────────────────────────────────────────────
function StepRouter() {
  const { state } = useMenu();
  const steps = [
    <MenuStep
      key="s"
      category="starters"
      title="Starters"
      subtitle="Set the tone with elegant opening courses"
      items={MENU_DATA.starters}
    />,
    <MenuStep
      key="m"
      category="mains"
      title="Main Courses"
      subtitle="The centrepiece of your event menu"
      items={MENU_DATA.mains}
    />,
    <MenuStep
      key="d"
      category="desserts"
      title="Desserts"
      subtitle="A memorable sweet finish to your occasion"
      items={MENU_DATA.desserts}
    />,
    <BeverageStep key="b" />,
    <EventDetailsStep key="e" />,
    <QuoteStep key="q" />,
  ];
  return (
    <div key={state.step} style={{ animation: "cardIn 0.3s ease" }}>
      {steps[state.step]}
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
export default function MenuBuilder() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MenuCtx.Provider value={{ state, dispatch }}>
      <style>{css}</style>
      <div className="mb-root">
        <div className="mb-header">
          <div className="mb-wordmark">Élara Catering</div>
          <div className="mb-header-sub">Menu Builder</div>
        </div>
        <ProgressBar />
        <div className="mb-body">
          <div className="mb-main">
            <StepRouter />
          </div>
          <CartSidebar />
        </div>
      </div>
    </MenuCtx.Provider>
  );
}
