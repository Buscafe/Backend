import Stripe from "stripe";

export const stripe = new Stripe(
    process.env.STRIPE_API_KEY_SECRET!,
    {
        apiVersion: '2020-08-27',
        appInfo: {
            name: 'Buscafe',
            version: '1.0.0'
        }
    }
);