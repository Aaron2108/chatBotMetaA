const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const path = require('path');
const MetaProvider = require('@bot-whatsapp/provider/meta');
const MockAdapter = require('@bot-whatsapp/database/mock');

// Construye la ruta al archivo PDF
const pdfPath = path.join(__dirname, 'media', 'pdf', 'Presentacion1TO.pdf');

const cotizacion1 = addKeyword('1').addAnswer('Este mensaje envia un PDF', {
    media: pdfPath,
});

const rangoInversion1 = addKeyword('1').addAnswer([
    'Indícame el rango de inversión que tienes proyectado:',
    '*1*: S/10,000 a S/15,000',
    '*2*: S/16 000 a S/24 000',
    '*3*: S/25 000 a S/34 000'
], null, null, [cotizacion1]);

const rangoCotizacion1 = addKeyword('1').addAnswer([
    'Indícame el rango en m² que tiene tu ambiente:',
    '*1*: 3m² a 5m²',
    '*2*: 6m² a 10m²',
    '*3*: 11m² a 15m²',
    '*4*: 16m² a 20m²'
], null, null, [rangoInversion1]);

const flujoCotizacion1 = addKeyword('1').addAnswer([
    'Qué ambiente necesitas:',
    '*1*: Sala comedor',
    '*2*: Sala cocina',
    '*3*: Sala dormitorio principal',
    '*4*: Sala dormitorio secundario',
    '*5*: Sala baño privado',
    '*6*: Sala baño de visitas'
], null, null, [rangoCotizacion1]);

const flujoPrincipal = addKeyword(['Hola', 'hola', 'buenas'])
    .addAnswer('Hola, ¿qué tal? Te saluda ... 😊')
    .addAnswer('¿Cuál es tu nombre?', { capture: true }, async (ctx, { flowDynamic }) => {
        try {
            const nombre = ctx.body;
            await flowDynamic([{ body: `Hola ${nombre}, ¿en qué te puedo ayudar hoy?` }]);
        } catch (error) {
            console.error('Error handling name capture:', error);
        }
    })
    .addAnswer([
        '*1*: Cotización de diseño por m²',
        '*2*: Cotización de implementación por depa completo m²',
        '*3*: Cotización de implementación por ambiente m²'
    ], null, null, [flujoCotizacion1]);

const flujoAdios = addKeyword(['gracias', 'adios', 'bye', 'chau']).addAnswer('Hasta luego');

const main = async () => {
    try {
        const adapterDB = new MockAdapter();
        const adapterFlow = createFlow([flujoPrincipal, flujoAdios, cotizacion1]);
        const adapterProvider = createProvider(MetaProvider, {
            jwtToken: 'EAAYgzcqAN3oBO3BaSRvbbd8JY9yWhMpE8C99ECNK6wzHyhWpZBGUgGUK2IRyLe2vRhIKoO1Rfaz6KPIo6G8ZBZArW3PZCMs9M2NGv2cqAzgWG2meDy0iR4ZBHXhF3LoNr66R6ZB4nqdkU3fVgvSRHnX4KNRE1D2iMOJRar4MKMiDqorc2jiqROlsRldPdArdj9cwEh8cMmpgEUKAzb2CuA5gylx2ZAOTAZAtbQcZD',
            numberId: '392059530655358',
            verifyToken: 'dasdasdasdas@dasdasd2108@Safiro',
            version: 'v16.0',
        });

        createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        });
    } catch (error) {
        console.error('Error initializing bot:', error);
    }
}

main().catch(error => console.error('Error in main function:', error));
