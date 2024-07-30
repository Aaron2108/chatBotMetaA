const { createBot, createProvider, createFlow, addKeyword,EVENTS } = require('@bot-whatsapp/bot')
const {join} = require('path')
const MetaProvider = require('@bot-whatsapp/provider/meta')
const MockAdapter = require('@bot-whatsapp/database/mock')

// const pdfPath = path.join(__dirname, 'media', 'pdf', 'Presentacion1TO.pdf');

// const cotizacion1 = addKeyword('1').addAnswer('Este mensaje envia un PDF', {
//     media: pdfPath, 
// });

const cotizacion1 = addKeyword('1').addAnswer(`Send file from Local`, { media: join(process.cwd(), 'src', 'pdf', 'presentacion1TO.pdf') })

    const rangoInversion1 = addKeyword('1').addAnswer(['Indícame el rango de inversión que tienes proyectado:'
        ,'*1*: S/10,000 a S/15,000'
        ,'*2*: S/16 000 a S/24 000'
        ,'*3*: S/25 000 a S/34 000'
    ],null,null, [cotizacion1])


    const rangoCotizacion1 = addKeyword('1').addAnswer(['Indícame el rango en m² que tiene tu ambiente:'
    ,'*1*: 3m² a 5m²'
    ,'*2*: 6m² a 10m²'
    ,'*3*: 11m² a 15m²'
    ,'*4*: 16m² a 20m²'
    ], null,null, [rangoInversion1])

    const flujoCotizacion1 = addKeyword('1')
    .addAnswer(['Que ambiente necesitas'
            ,'*1*: Sala comedor'
            ,'*2*: Sala cocina'
            ,'*3*: Sala dormitorio principal'
            ,'*4*: Sala dormitorio secundario'
            ,'*5*: Sala baño privado'
            ,'*6*: Sala baño de visitas'
        ], null,null,[rangoCotizacion1])

        const flujoPrincipal = addKeyword(['Hola', 'hola', 'buenas'])
        .addAnswer('hola que tal te saluda ... 😊')
        .addAnswer('¿Cual es tu nombre?', {capture:true}, async (ctx,{flowDynamic}) =>{
            // if(!ctx.body.includes('@')){
            //     return fallBack()
            // }
            const nombre = ctx.body;
            await flowDynamic([
                {body:`Hola ${nombre}, en que te puedo ayudar hoy?`}
                
            ])
        }).addAnswer(['*1*: Cotización de diseño por m²'
            , '*2*: Cotización de implementación por depa completo m²'
            ,'*3*: Cotización de implementación por ambiente m²'],null, null, [flujoCotizacion1])

        
        const flujoAdios = addKeyword(['gracias', 'adios', 'bye', 'chau']).addAnswer('hasta luego')


        // {
        //     buttons: [{ body: 'diseño' },
        //             { body: 'implementacion'},
        //             { body: 'implementacion'}],
        // }

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal,flujoAdios, cotizacion1])

    const adapterProvider = createProvider(MetaProvider, {
        jwtToken: 'EAAYgzcqAN3oBOxZBYiXvGgLkIqJlyrQCeootSWflbMIC7fNl0rP5vnB9WHIRHgoteto5OOZCv7CiAA3v1wYhdi4Xldx9ZCJgFPzPpTEsKeBn2s5zcNZC2KCMzSdxTHoAuHPmhVEirJM31NwlhhH1hpEKZCdNbExTFuPgHAnBlYZCK06i2A4PaZB2MCLLLYrpPkC1ZBdmdLJLzcKB46ctH12eiEJkzm2p63M22ecZD',
        numberId: '392059530655358',
        verifyToken: 'dasdasdasdas@dasdasd2108@Safiro',
        version: 'v16.0',
    })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
}

main()
