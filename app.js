import express from 'express'
import { engine } from 'express-handlebars'
import { __dirname } from "./utils/path.js"
import * as path from 'path'
import { MercadoPagoConfig, Preference } from 'mercadopago'


const app = express()
const port = process.env.PORT || 3000


const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-8709825494258279-092911-227a84b3ec8d8b30fff364888abeb67a-1160706432',
    options: { timeout: 5000 },
})

const preference = new Preference(client)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

app.use(express.static('assets'))
app.set('views', path.resolve(__dirname, './views')) 
app.use('/assets', express.static(__dirname + '/assets'))

app.use(express.json())  
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('home', {view:'home'})
})

app.get('/detail', (req, res) => {
    const info = req.query
    res.render('detail', { view:'item', script:'index.js', data: info})
})

app.post('/detail', async (req, res) => {
    const { title, unit, img, price, id } = req.body
    console.log(title, unit, img, price, id )

    await preference.create( { body: {
        items: [{
            id: id,
            title: title,
            description: 'Dispositivo móvil de Tienda e-commerce',
            quantity: JSON.parse(unit),
            unit_price: JSON.parse(price) ,
            picture_url: img,
        }],
        payer:{
            name: 'Lalo',
            surname: 'Landa',
            email: 'test_user_36961754@testuser.com',
            phone: {
                area_code: 'ARS',
                number: 1124290671
            },
            address: {
                street_name: 'calle falsa',
                street_number: 123,
                zip_code: 'B1708KDA' 
            },
            
        },
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: 'visa'
                }
            ],
            installments: 6,
        },
        external_reference: 'magalisol2307@gmail.com',
        back_urls: {
            success: 'https://magalizap-mp-commerce-nodejs.onrender.com/success', //  http://localhost:3000/success
            failure: 'https://magalizap-mp-commerce-nodejs.onrender.com/failure', //  http://localhost:3000/failure
            pending: 'https://magalizap-mp-commerce-nodejs.onrender.com/pending'  //  http://localhost:3000/pending
        },

        notification_url: 'https://magalizap-mp-commerce-nodejs.onrender.com/webhook', //    http://localhost:3000/webhook
        auto_return: 'approved',

    }, requestOptions: {
        integratorId: 'dev_24c65fb163bf11ea96500242ac130004',
    }})
    .then((response) => {
        res.json({
            id: response.id
        })
    })
	.catch((error) => console.log(error))
    
})

app.get('/success', (req, res) => {
	res.render('success',{
		payment: req.query.payment_id,
		status: req.query.status,
		merchantOrder: req.query.merchant_order_id,
        externalReference: req.query.external_reference,
        paymentType: req.query.payment_type
	})
})

app.get('/failure', (req, res) => {
	res.render('failure',{
		payment: req.query.payment_id,
		status: req.query.status,
		merchantOrder: req.query.merchant_order_id,
        externalReference: req.query.external_reference,
        paymentType: req.query.payment_type
	})
})

app.get('/pending', (req, res) => {
	res.render('pending',{
		payment: req.query.payment_id,
		status: req.query.status,
		merchantOrder: req.query.merchant_order_id,
        externalReference: req.query.external_reference,
        paymentType: req.query.payment_type
	})
})

app.post('/webhook', async (req, res) => {
    const payment = req.query
    /*console.log(payment)
    if(payment.type === 'payment'){
        const data = await preference.search(payment['data.id'])
        console.log(data)
    }*/
    
    res.json({result: payment})
})


app.listen(port, () => {
    console.log(`Server on port ${port}`)
})
