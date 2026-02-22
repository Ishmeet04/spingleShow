import Stripe from "stripe";
import Booking from "../models/Booking.js";
import { inngest } from "../Inngest/index.js";

export const stripeWebhooks = async (request, response) => {
    console.log("--- Stripe Webhook Triggered ---");
    const stripeInstance = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);
    const sig = request.headers["stripe-signature"];

    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return response.status(400).send(`Webhook error : ${error.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const { bookingId } = session.metadata;

                console.log("Processing checkout.session.completed for Booking:", bookingId);

                await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: '',
                })

                // send a email through nodemailer
                console.log("--- Sending Inngest Event: app/show.booked ---");
                await inngest.send({
                    name: 'app/show.booked',
                    data: { bookingId },
                })
                console.log("--- Inngest Event Sent ---");
                break;
            }

            default:
                console.log('Unhandled event type :', event.type)
                break;
        }
        response.json({ received: true });
    } catch (error) {
        console.log('Webhook processing error:', error);
        response.status(500).send("Internal Server Error");
    }
}