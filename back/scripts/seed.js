import bcrypt from "bcrypt"
import { db, ensureIndexes } from "../services/db.service.js"
import { config } from "../config.js"

const haceDias = (dias) => new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString()

const usuarios = [
    {
        name: "SuperAdmin",
        username: "Nicolas",
        email: "superadmin@recetario.com",
        password: "Admin1234@",
        rol: "superadmin"
    },
    {
        name: "Cocina de la Abuela",
        username: "abuela",
        email: "chef@recetario.com",
        password: "Cocina1234@",
        rol: "admin"
    },
    {
        name: "Sofia Vecina",
        username: "sofia",
        email: "sofia@recetario.com",
        password: "Vecina1234@",
        rol: "user"
    }
]

const categorias = [
    { nombre: "Desayunos", slug: "desayunos", emoji: "🥐", descripcion: "Para arrancar el dia con energia", orden: 1 },
    { nombre: "Almuerzos", slug: "almuerzos", emoji: "🍲", descripcion: "Platos principales del mediodia", orden: 2 },
    { nombre: "Meriendas", slug: "meriendas", emoji: "🧁", descripcion: "Algo rico para la tarde", orden: 3 },
    { nombre: "Cenas", slug: "cenas", emoji: "🍝", descripcion: "Recetas para cerrar el dia", orden: 4 },
    { nombre: "Postres", slug: "postres", emoji: "🍰", descripcion: "El dulce final", orden: 5 },
    { nombre: "Bebidas", slug: "bebidas", emoji: "🥤", descripcion: "Jugos, limonadas y licuados", orden: 6 }
]

const autorAbuela = { email: "chef@recetario.com", nombre: "Cocina de la Abuela", username: "abuela" }
const autorSofia = { email: "sofia@recetario.com", nombre: "Sofia Vecina", username: "sofia" }

const recetas = [
    {
        titulo: "Panqueques de avena y banana",
        descripcion: "Panqueques esponjosos con avena y banana, ideales para un desayuno completo sin harinas refinadas.",
        categoria: "desayunos",
        ingredientes: [
            { cantidad: "1 taza", nombre: "avena instantanea" },
            { cantidad: "1 unidad", nombre: "banana madura" },
            { cantidad: "2 unidades", nombre: "huevos" },
            { cantidad: "1/2 taza", nombre: "leche" },
            { cantidad: "1 cucharadita", nombre: "polvo de hornear" },
            { cantidad: "1 pizca", nombre: "canela" }
        ],
        pasos: [
            { texto: "Pisar la banana en un bowl hasta obtener un pure sin grumos." },
            { texto: "Agregar los huevos, la leche y la avena. Mezclar hasta integrar." },
            { texto: "Incorporar el polvo de hornear y la canela y dejar reposar 5 minutos." },
            { texto: "Cocinar cucharones sobre una sarten caliente aceitada, 2 minutos de cada lado." },
            { texto: "Servir con frutos rojos y un hilo de miel." }
        ],
        tiempoMinutos: 20,
        porciones: 3,
        dificultad: "facil",
        imagen: "/img/recetas/panqueques-avena.jpg",
        autor: autorAbuela,
        fechaCreacion: haceDias(2)
    },
    {
        titulo: "Tostadas con palta y huevo revuelto",
        descripcion: "El desayuno de los domingos: pan tostado, palta pisada, huevos revueltos cremosos y tomates cherry.",
        categoria: "desayunos",
        ingredientes: [
            { cantidad: "2 rodajas", nombre: "pan de campo" },
            { cantidad: "1 unidad", nombre: "palta madura" },
            { cantidad: "2 unidades", nombre: "huevos" },
            { cantidad: "6 unidades", nombre: "tomates cherry" },
            { cantidad: "1 cucharada", nombre: "aceite de oliva" },
            { cantidad: "A gusto", nombre: "sal y pimienta" }
        ],
        pasos: [
            { texto: "Tostar las rodajas de pan hasta que queden crocantes." },
            { texto: "Pisar la palta con un tenedor y condimentar con sal, pimienta y unas gotas de limon." },
            { texto: "Batir los huevos y cocinarlos a fuego bajo revolviendo siempre, para que queden cremosos." },
            { texto: "Armar la tostada con la palta, los huevos y los tomates cherry cortados al medio." },
            { texto: "Terminar con un hilo de aceite de oliva." }
        ],
        tiempoMinutos: 15,
        porciones: 1,
        dificultad: "facil",
        imagen: "/img/recetas/tostadas-palta-huevo.jpg",
        autor: autorSofia,
        fechaCreacion: haceDias(5)
    },
    {
        titulo: "Milanesas de pollo con papas rusticas",
        descripcion: "Milanesas de pechuga de pollo bien crocantes, acompanadas de papas rusticas al horno con romero.",
        categoria: "almuerzos",
        ingredientes: [
            { cantidad: "2 unidades", nombre: "pechugas de pollo" },
            { cantidad: "2 unidades", nombre: "huevos" },
            { cantidad: "200 g", nombre: "pan rallado" },
            { cantidad: "2 cucharadas", nombre: "queso rallado" },
            { cantidad: "4 unidades", nombre: "papas medianas" },
            { cantidad: "1 cucharadita", nombre: "romero seco" },
            { cantidad: "A gusto", nombre: "sal, pimienta y ajo en polvo" }
        ],
        pasos: [
            { texto: "Cortar las pechugas en filetes finos y condimentarlos con sal, pimienta y ajo." },
            { texto: "Pasar cada filete por huevo batido y luego por la mezcla de pan rallado con queso." },
            { texto: "Cortar las papas en bastones, condimentar con romero y aceite y hornear 30 minutos a 200 grados." },
            { texto: "Cocinar las milanesas en aceite bien caliente hasta que esten doradas de los dos lados." },
            { texto: "Servir con las papas y una rodaja de limon." }
        ],
        tiempoMinutos: 45,
        porciones: 4,
        dificultad: "media",
        imagen: "/img/recetas/milanesas-pollo.jpg",
        autor: autorAbuela,
        fechaCreacion: haceDias(8)
    },
    {
        titulo: "Paella valenciana",
        descripcion: "Arroz con azafran, mariscos y verduras cocinado en paellera. Un clasico espanol para compartir.",
        categoria: "almuerzos",
        ingredientes: [
            { cantidad: "400 g", nombre: "arroz de grano corto" },
            { cantidad: "300 g", nombre: "mariscos surtidos" },
            { cantidad: "1 unidad", nombre: "morro de ternera" },
            { cantidad: "1 unidad", nombre: "morro de cerdo" },
            { cantidad: "1 unidad", nombre: "morro de cordero" },
            { cantidad: "1 sobre", nombre: "azafran en hebras" },
            { cantidad: "1 unidad", nombre: "morron rojo" },
            { cantidad: "1 litro", nombre: "caldo de pollo" }
        ],
        pasos: [
            { texto: "Calentar la paellera con aceite y dorar las carnes por todos lados." },
            { texto: "Agregar el morron cortado y cocinar unos minutos hasta que se ablande." },
            { texto: "Sumar el arroz y mezclar para que se impregne con el aceite y los sabores." },
            { texto: "Incorporar el caldo caliente con el azafran y cocinar sin revolver 18 minutos." },
            { texto: "Agregar los mariscos en los ultimos 5 minutos y dejar reposar fuera del fuego antes de servir." }
        ],
        tiempoMinutos: 60,
        porciones: 6,
        dificultad: "dificil",
        imagen: "/img/recetas/paella-valenciana.jpg",
        autor: autorAbuela,
        fechaCreacion: haceDias(12)
    },
    {
        titulo: "Noquis de papa con salsa de tomate",
        descripcion: "Noquis caseros de papa, tiernos y livianos, con una salsa de tomate cocida a fuego lento.",
        categoria: "cenas",
        ingredientes: [
            { cantidad: "1 kg", nombre: "papas" },
            { cantidad: "300 g", nombre: "harina" },
            { cantidad: "1 unidad", nombre: "huevo" },
            { cantidad: "500 g", nombre: "tomates perita" },
            { cantidad: "1 unidad", nombre: "cebolla" },
            { cantidad: "2 dientes", nombre: "ajo" },
            { cantidad: "A gusto", nombre: "sal, pimienta y albahaca" }
        ],
        pasos: [
            { texto: "Hervir las papas hasta que esten tiernas, pisarlas y dejarlas enfriar." },
            { texto: "Formar un anillo con el pure, agregar el huevo, la harina y la sal e integrar sin amasar demasiado." },
            { texto: "Armar rollitos y cortar los noquis del tamano deseado." },
            { texto: "Para la salsa, rehogar cebolla y ajo, agregar el tomate y cocinar 20 minutos." },
            { texto: "Hervir los noquis hasta que suban a la superficie y mezclarlos con la salsa." }
        ],
        tiempoMinutos: 50,
        porciones: 4,
        dificultad: "media",
        imagen: "/img/recetas/noquis-tomate.jpg",
        autor: autorAbuela,
        fechaCreacion: haceDias(15)
    },
    {
        titulo: "Crema de calabaza y jengibre",
        descripcion: "Una crema suave y reconfortante, con un toque de jengibre que le da un sabor especial.",
        categoria: "cenas",
        ingredientes: [
            { cantidad: "1 unidad", nombre: "calabaza" },
            { cantidad: "1 unidad", nombre: "cebolla" },
            { cantidad: "1 cucharadita", nombre: "jengibre rallado" },
            { cantidad: "500 ml", nombre: "caldo de verduras" },
            { cantidad: "100 ml", nombre: "crema de leche" },
            { cantidad: "A gusto", nombre: "sal, pimienta y nuez moscada" }
        ],
        pasos: [
            { texto: "Cortar la calabaza en cubos y picar la cebolla." },
            { texto: "Rehogar la cebolla y el jengibre en una olla con aceite." },
            { texto: "Agregar la calabaza y el caldo y cocinar 20 minutos hasta que este blanda." },
            { texto: "Licuar todo hasta obtener una crema pareja." },
            { texto: "Volver al fuego, agregar la crema y condimentar antes de servir." }
        ],
        tiempoMinutos: 35,
        porciones: 4,
        dificultad: "facil",
        imagen: "/img/recetas/crema-calabaza.jpg",
        autor: autorSofia,
        fechaCreacion: haceDias(18)
    },
    {
        titulo: "Muffins de arandanos",
        descripcion: "Muffins esponjosos con arandanos frescos, perfectos para la merienda con un cafe o un te.",
        categoria: "meriendas",
        ingredientes: [
            { cantidad: "2 tazas", nombre: "harina" },
            { cantidad: "1 taza", nombre: "azucar" },
            { cantidad: "2 unidades", nombre: "huevos" },
            { cantidad: "1 taza", nombre: "leche" },
            { cantidad: "100 g", nombre: "manteca derretida" },
            { cantidad: "1 taza", nombre: "arandanos" },
            { cantidad: "2 cucharaditas", nombre: "polvo de hornear" }
        ],
        pasos: [
            { texto: "Precalentar el horno a 180 grados y preparar los pirotines." },
            { texto: "Mezclar los ingredientes secos: harina, azucar y polvo de hornear." },
            { texto: "En otro bowl batir los huevos con la leche y la manteca derretida." },
            { texto: "Unir ambas mezclas sin batir de mas y agregar los arandanos con movimientos suaves." },
            { texto: "Repartir en los pirotines y hornear 25 minutos hasta que esten dorados." }
        ],
        tiempoMinutos: 35,
        porciones: 12,
        dificultad: "facil",
        imagen: "/img/recetas/muffins-arandanos.jpg",
        autor: autorAbuela,
        fechaCreacion: haceDias(21)
    },
    {
        titulo: "Scones de queso",
        descripcion: "Scones salados con queso parmesano, ideales para acompanar una merienda o una picada.",
        categoria: "meriendas",
        ingredientes: [
            { cantidad: "300 g", nombre: "harina" },
            { cantidad: "100 g", nombre: "manteca fria" },
            { cantidad: "150 g", nombre: "queso parmesano rallado" },
            { cantidad: "1 unidad", nombre: "huevo" },
            { cantidad: "100 ml", nombre: "leche" },
            { cantidad: "1 cucharadita", nombre: "polvo de hornear" }
        ],
        pasos: [
            { texto: "Mezclar la harina con el polvo de hornear y la manteca en cubos hasta formar un arenado." },
            { texto: "Agregar el queso y luego el huevo con la leche hasta formar una masa." },
            { texto: "Estirar la masa de 2 cm de alto y cortar circulos." },
            { texto: "Pincelar con leche y hornear 20 minutos a 190 grados." },
            { texto: "Dejar enfriar sobre una rejilla antes de servir." }
        ],
        tiempoMinutos: 30,
        porciones: 8,
        dificultad: "media",
        imagen: "/img/recetas/scones-queso.jpg",
        autor: autorSofia,
        fechaCreacion: haceDias(24)
    },
    {
        titulo: "Tarta de manzana",
        descripcion: "Tarta clasica con manzanas caramelizadas y una masa quebrada que se deshace en la boca.",
        categoria: "postres",
        ingredientes: [
            { cantidad: "300 g", nombre: "harina" },
            { cantidad: "150 g", nombre: "manteca" },
            { cantidad: "4 unidades", nombre: "manzanas" },
            { cantidad: "150 g", nombre: "azucar" },
            { cantidad: "2 unidades", nombre: "huevos" },
            { cantidad: "1 cucharadita", nombre: "canela" },
            { cantidad: "1 cucharada", nombre: "azucar impalpable" }
        ],
        pasos: [
            { texto: "Formar la masa con harina, manteca fria y azucar. Dejar reposar 30 minutos en la heladera." },
            { texto: "Pelar las manzanas y cortarlas en laminas finas." },
            { texto: "Forrar la tartera con la masa y acomodar las manzanas en circulos." },
            { texto: "Espolvorear con canela y azucar y hornear 40 minutos a 180 grados." },
            { texto: "Dejar enfriar y terminar con azucar impalpable." }
        ],
        tiempoMinutos: 75,
        porciones: 8,
        dificultad: "media",
        imagen: "/img/recetas/tarta-manzana.jpg",
        autor: autorAbuela,
        fechaCreacion: haceDias(27)
    },
    {
        titulo: "Brownies de chocolate",
        descripcion: "Brownies humedos por dentro y con una capa crocante por fuera. Solo chocolate y amor.",
        categoria: "postres",
        ingredientes: [
            { cantidad: "200 g", nombre: "chocolate semiamargo" },
            { cantidad: "150 g", nombre: "manteca" },
            { cantidad: "3 unidades", nombre: "huevos" },
            { cantidad: "200 g", nombre: "azucar" },
            { cantidad: "100 g", nombre: "harina" },
            { cantidad: "1 pizca", nombre: "sal" }
        ],
        pasos: [
            { texto: "Derretir el chocolate con la manteca a bano maria." },
            { texto: "Batir los huevos con el azucar hasta que la mezcla este clara." },
            { texto: "Incorporar el chocolate derretido y luego la harina con la sal." },
            { texto: "Verter en un molde enmantecado y hornear 25 minutos a 180 grados." },
            { texto: "Cortar en cuadrados cuando este tibio." }
        ],
        tiempoMinutos: 40,
        porciones: 12,
        dificultad: "facil",
        imagen: "/img/recetas/brownies-chocolate.jpg",
        autor: autorSofia,
        fechaCreacion: haceDias(30)
    },
    {
        titulo: "Limonada con menta y jengibre",
        descripcion: "Una bebida fresca y aromatica, ideal para los dias de calor.",
        categoria: "bebidas",
        ingredientes: [
            { cantidad: "4 unidades", nombre: "limones" },
            { cantidad: "1 litro", nombre: "agua fria" },
            { cantidad: "3 cucharadas", nombre: "azucar" },
            { cantidad: "10 hojas", nombre: "menta fresca" },
            { cantidad: "1 cucharadita", nombre: "jengibre rallado" },
            { cantidad: "A gusto", nombre: "hielo" }
        ],
        pasos: [
            { texto: "Exprimir los limones y colar el jugo." },
            { texto: "Mezclar el jugo con el agua, el azucar y el jengibre." },
            { texto: "Agregar la menta y machacarla suavemente para liberar el aroma." },
            { texto: "Dejar reposar en la heladera 30 minutos." },
            { texto: "Servir con hielo y una rodaja de limon." }
        ],
        tiempoMinutos: 10,
        porciones: 4,
        dificultad: "facil",
        imagen: "/img/recetas/limonada-menta.jpg",
        autor: autorSofia,
        fechaCreacion: haceDias(33)
    },
    {
        titulo: "Licuado de frutillas y banana",
        descripcion: "Un licuado cremoso y natural, listo en cinco minutos para la merienda o el desayuno.",
        categoria: "bebidas",
        ingredientes: [
            { cantidad: "200 g", nombre: "frutillas" },
            { cantidad: "1 unidad", nombre: "banana" },
            { cantidad: "250 ml", nombre: "leche" },
            { cantidad: "2 cucharadas", nombre: "yogur natural" },
            { cantidad: "1 cucharadita", nombre: "miel" }
        ],
        pasos: [
            { texto: "Lavar y desinfectar las frutillas." },
            { texto: "Colocar todos los ingredientes en la licuadora." },
            { texto: "Licuar hasta que quede bien cremoso." },
            { texto: "Probar y ajustar el dulzor con un poco mas de miel." },
            { texto: "Servir bien frio." }
        ],
        tiempoMinutos: 5,
        porciones: 2,
        dificultad: "facil",
        imagen: "/img/recetas/licuado-frutillas.jpg",
        autor: autorAbuela,
        fechaCreacion: haceDias(36)
    }
]

async function main() {
    const destino = new URL(config.mongoUri)
    destino.username = ""
    destino.password = ""
    console.log("Conectando a", destino.toString(), "-", config.dbName)

    await Promise.all([
        db.collection("usuarios").deleteMany({}),
        db.collection("recetas").deleteMany({}),
        db.collection("categorias").deleteMany({}),
        db.collection("favoritos").deleteMany({})
    ])

    // Usuarios con password encriptada
    const usuariosConPassword = []
    for (const usuario of usuarios) {
        const { password, ...resto } = usuario
        usuariosConPassword.push({
            ...resto,
            password: await bcrypt.hash(password, 10),
            fechaCreacion: haceDias(40)
        })
    }
    await db.collection("usuarios").insertMany(usuariosConPassword)

    // Categorias
    await db.collection("categorias").insertMany(
        categorias.map(categoria => ({ ...categoria, eliminado: false }))
    )

    // Recetas
    const recetasCompletas = recetas.map(receta => ({
        ...receta,
        fechaActualizacion: receta.fechaCreacion,
        eliminado: false
    }))
    await db.collection("recetas").insertMany(recetasCompletas)

    // Favoritos de la usuaria demo
    const recetasDB = await db.collection("recetas").find({}).toArray()
    const favoritas = ["Paella valenciana", "Brownies de chocolate", "Limonada con menta y jengibre"]
    const favoritos = recetasDB
        .filter(receta => favoritas.includes(receta.titulo))
        .map((receta, indice) => ({
            usuarioEmail: "sofia@recetario.com",
            recetaId: receta._id,
            fechaCreacion: haceDias(indice)
        }))
    if (favoritos.length > 0) await db.collection("favoritos").insertMany(favoritos)
    await ensureIndexes()

    console.log(`Listo: ${usuariosConPassword.length} usuarios, ${categorias.length} categorias, ${recetasCompletas.length} recetas, ${favoritos.length} favoritos`)
    console.log("Usuarios de prueba:")
    usuarios.forEach(u => console.log(` - ${u.email} / ${u.password} (${u.rol})`))
    process.exit(0)
}

main().catch(error => {
    console.error("Error en el seed:", error.message)
    process.exit(1)
})
