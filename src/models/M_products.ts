import { stripe } from "../services/stripe";

export async function getAllPlans(){
    try {
        const allPlans = await stripe.products.list();
        
        return {
            code: 1,
            plans: allPlans.data
        }
    } catch (err) {
        return {
            'code': 2,
            'msg' : 'Não foi possível acessar os produtos',
            'err' : err 
        }
    }
}

interface createSessionProps {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
}
export async function createSession({ priceId, successUrl, cancelUrl }: createSessionProps){
    try {
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                { price: priceId, quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: successUrl,
            cancel_url: cancelUrl
        })

        return {
            sessionId: stripeCheckoutSession.id,
        }
    } catch (err) {
        return {
            'code': 2,
            'msg' : 'Não foi possível criar uma sessão do produto',
            'err' : err 
        }
    }
}