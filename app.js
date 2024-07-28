const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const MetaProvider = require('@bot-whatsapp/provider/meta')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flujoCotizacion1 = addKeyword('1')
.addAnswer(['Que ambiente necesitas'
            , '*1*: sala comedor'
            ,'*2*: sala cocina'
            ,'*3*: sala dormitorio principal'
            ,'*4*: sala dormitorio secundario'
            ,'*5*: sala baño privado'
            ,'*6*: sala baño de visitas'
        ])

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
        }).addAnswer('Cotización en: ', {
            buttons: [{ body: 'Diseño por m²' },
                    { body: 'Diseño por m²'},
                    { body: 'Diseño por m²'}],
        })
        
        const flujoAdios = addKeyword(['gracias', 'adios', 'bye', 'chau']).addAnswer('hasta luego')

        // ['*1*: Cotización de diseño por (m2)'
        //     , '*2*: Cotización de implementación por depa completo (m2)'
        //     ,'*3*: Cotización de implementación por ambiente (m2)'],
        

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal,flujoAdios])

    const adapterProvider = createProvider(MetaProvider, {
        jwtToken: 'EAAYgzcqAN3oBO1rXZA7xw9jD573KEdaSf19nTjWm6bH01FadBHnUGT5yMD3idVia6WPgh8R8cvP8xB3tiDBYAdExzLP7uiqy0ZAX5qZAUm1ZAYLQTc9QFCdYFl0jZADtL5rfyfNopEm15txwQtUTULbceimrFRIIStv8SPJXhdb6Bqc3wrH7pLqZCFcrIoyuuZBmyr42Iq790cyKJzZAGVcZD',
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
