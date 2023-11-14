const mp = new MercadoPago('APP_USR-ff96fe80-6866-4888-847e-c69250754d38');


document.getElementById('checkout-btn').addEventListener('click', () => {
    const orderData = {  //title, unit, img, price 
        id: 1234,
        img: document.getElementById('img').currentSrc,
        title: document.getElementById('title').innerHTML,
        unit: document.getElementById('unit').innerHTML,
        price: document.getElementById('price').innerHTML
    }
    console.log(orderData)
    fetch('http://localhost:3000/detail', { //https://magalizap-mp-commerce-nodejs.onrender.com/detail
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData)
        
    })
    .then((response) => {
        return response.json()
    })
    .then((preference) => {
        createCheckoutButton(preference.id)
    })
    .catch((error) => console.log(error))
})

const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mp.bricks()
    const renderComponent = async (bricksBuilder) => {
        if(window.checkoutButton) window.checkoutButton.unmount()
        await bricksBuilder.create('wallet', 'button-checkout', {
            initialization: {
                preferenceId: preferenceId,
                redirectMode: 'modal'
            },
            customization: {
                visual: {
                    buttonBackground: 'black',
                },
                checkout: {
                    theme: {
                        elementsColor: "#4287F5",
                        headerColor: "#4287F5",
                    },
                },
            },
        })
    }
    window.checkoutButton = renderComponent(bricksBuilder)
}

