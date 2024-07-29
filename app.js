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
            buttons: [{ body: 'diseño' },
                    { body: 'implementacion'},
                    { body: 'implementacion'}],
        })
        
        const flujoAdios = addKeyword(['gracias', 'adios', 'bye', 'chau']).addAnswer('hasta luego')

        // ['*1*: Cotización de diseño por (m2)'
        //     , '*2*: Cotización de implementación por depa completo (m2)'
        //     ,'*3*: Cotización de implementación por ambiente (m2)'],
        

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal,flujoAdios])

    const adapterProvider = createProvider(MetaProvider, {
        jwtToken: 'EAAYgzcqAN3oBO3BaSRvbbd8JY9yWhMpE8C99ECNK6wzHyhWpZBGUgGUK2IRyLe2vRhIKoO1Rfaz6KPIo6G8ZBZArW3PZCMs9M2NGv2cqAzgWG2meDy0iR4ZBHXhF3LoNr66R6ZB4nqdkU3fVgvSRHnX4KNRE1D2iMOJRar4MKMiDqorc2jiqROlsRldPdArdj9cwEh8cMmpgEUKAzb2CuA5gylx2ZAOTAZAtbQcZD',
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
