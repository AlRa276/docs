export const categories = [
    { name: "Todos", icon: "squares" },
    { name: "Pollo y carne", icon: "fire" },
    { name: "Saludable", icon: "leaf" },
    { name: "Ensalada", icon: "bowl" },
    { name: "Guarniciones", icon: "pot" },
    { name: "Postres", icon: "cake" }
];

export const recipesData = [
    {
        id: 1,
        title: "Pollo Relleno con Nuez",
        category: "Pollo y carne",
        time: "45 min",
        servings: 2,
        difficulty: "Fácil",
        rating: 0,
        image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=800&auto=format&fit=crop",
        description: "Esta receta de pollo relleno de manzana con nuez es perfecta para la cena de Navidad, si tendrás pocos invitados y un pavo es demasiado grande. Prueba este pollo rostizado con miel para cualquier reunión especial y dale un giro a tu comida.",
        ingredients: [
            { amount: "200 g", name: "de manzana picada en cubos" },
            { amount: "200 g", name: "de manzana roja picada en cubos" },
            { amount: "150 g", name: "de nuez picada finamente" },
            { amount: "25 g", name: "de jengibre en polvo" },
            { amount: "25 g", name: "de tomillo en polvo" },
            { amount: "1", name: "pechuga de pollo entera" }
        ],
        steps: [
            { instruction: "Salpimentar el pollo por dentro y por fuera.", timer: null },
            { instruction: "Haz la mezcla del relleno combinando las manzanas, nueces y especias.", timer: 300 }, // 5 mins prep
            { instruction: "Rellena el pollo con la mezcla y cierra con palillos si es necesario.", timer: null },
            { instruction: "Dejar reposar el pollo con la mezcla por 15 minutos en el refrigerador.", timer: 900 }, // 15 mins
            { instruction: "Hornear el pollo a 180°C durante 45 minutos o hasta que esté dorado.", timer: 2700 }, // 45 mins
            { instruction: "Servir caliente acompañado de una ensalada fresca.", timer: null }
        ]
    },
    {
        id: 2,
        title: "Spaghetti con nuez",
        category: "Saludable",
        time: "30 min",
        servings: 2,
        difficulty: "Fácil",
        rating: 0,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop",
        description: "Un plato de pasta ligero y nutritivo con el toque crujiente de las nueces y la suavidad del parmesano.",
        ingredients: [
            { amount: "400 g", name: "de spaghetti" },
            { amount: "100 g", name: "de nuez picada" },
            { amount: "50 g", name: "de queso parmesano" }
        ],
        steps: [
            { instruction: "Cocer la pasta al dente en agua hirviendo con sal durante 10 minutos.", timer: 600 },
            { instruction: "Tostar las nueces ligeramente en una sartén sin aceite.", timer: 120 }, // 2 mins
            { instruction: "Mezclar pasta con nueces y un chorrito de aceite de oliva virgen extra.", timer: null },
            { instruction: "Servir inmediatamente espolvoreando con queso rallado.", timer: null }
        ]
    },
    {
        id: 3,
        title: "Spaghetti cremoso",
        category: "Guarniciones",
        time: "35 min",
        servings: 3,
        difficulty: "Medio",
        rating: 0,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
        description: "La combinación perfecta de cremosidad y sabor umami de los champiñones.",
        ingredients: [
            { amount: "400 g", name: "de spaghetti" },
            { amount: "200 ml", name: "de crema de leche" },
            { amount: "100 g", name: "de champiñones laminados" }
        ],
        steps: [
            { instruction: "Cocer la pasta según las instrucciones del paquete.", timer: 600 },
            { instruction: "Sofreír los champiñones en mantequilla hasta que doren.", timer: 480 }, // 8 mins
            { instruction: "Agregar la crema de leche y dejar reducir a fuego lento por 5 minutos.", timer: 300 },
            { instruction: "Incorporar la pasta cocida a la salsa y mezclar bien.", timer: 120 }
        ]
    },
    {
        id: 4,
        title: "Spaghetti con salsa",
        category: "Guarniciones",
        time: "40 min",
        servings: 4,
        difficulty: "Fácil",
        rating: 0,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=800&auto=format&fit=crop",
        description: "Receta tradicional italiana con salsa de tomate casera llena de sabor.",
        ingredients: [
            { amount: "500 g", name: "de spaghetti" },
            { amount: "5", name: "tomates maduros" },
            { amount: "1", name: "cebolla picada" }
        ],
        steps: [
            { instruction: "Sofreír la cebolla hasta que esté transparente.", timer: 300 },
            { instruction: "Añadir los tomates picados y cocinar a fuego lento por 20 minutos para hacer la salsa.", timer: 1200 },
            { instruction: "Cocer la pasta al dente.", timer: 600 },
            { instruction: "Mezclar la pasta con la salsa y servir con albahaca fresca.", timer: null }
        ]
    },
    {
        id: 5,
        title: "Ensalada César",
        category: "Ensalada",
        time: "15 min",
        servings: 2,
        difficulty: "Fácil",
        rating: 0,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
        description: "Clásica ensalada con aderezo casero y crutones crujientes.",
        ingredients: [
            { amount: "1", name: "lechuga romana" },
            { amount: "100 g", name: "crutones" },
            { amount: "50 g", name: "queso parmesano" }
        ],
        steps: [
            { instruction: "Lavar y desinfectar la lechuga hoja por hoja.", timer: 300 },
            { instruction: "Preparar el aderezo mezclando anchoas, ajo, yema de huevo y aceite.", timer: 300 },
            { instruction: "Mezclar la lechuga con el aderezo, añadir crutones y queso parmesano al gusto.", timer: null }
        ]
    },
    {
        id: 6,
        title: "Salmón a la plancha",
        category: "Saludable",
        time: "25 min",
        servings: 2,
        difficulty: "Medio",
        rating: 0,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=800&auto=format&fit=crop",
        description: "Salmón jugoso y saludable con un toque cítrico.",
        ingredients: [
            { amount: "2", name: "filetes de salmón" },
            { amount: "1", name: "limón" },
            { amount: "20 g", name: "mantequilla" }
        ],
        steps: [
            { instruction: "Sazonar el salmón con sal, pimienta y un poco de jugo de limón.", timer: 180 },
            { instruction: "Calentar la sartén con mantequilla a fuego medio-alto.", timer: 120 },
            { instruction: "Cocinar el salmón por el lado de la piel primero durante 4 minutos.", timer: 240 },
            { instruction: "Voltear y cocinar por el otro lado 3 minutos más.", timer: 180 },
            { instruction: "Servir inmediatamente decorado con rodajas de limón.", timer: null }
        ]
    }
];
