import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../config/nodemailer.js";
import Movie from "../models/Movie.js";


export const inngest = new Inngest({ id: "movie-ticket-booking" });

const userCreated = inngest.createFunction(
    { id: 'create-user' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userdata = {
            _id: id,
            name: first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            image: image_url
        }
        await User.create(userdata);
    }
)
const userUpdated = inngest.createFunction(
    { id: 'update-user' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userdata = {
            _id: id,
            name: first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userdata);
    }
)
const userDeleted = inngest.createFunction(
    { id: 'delete-user' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id);
    }
)

const releaseSeatsandDeletebooking = inngest.createFunction(
    { id: 'relese-seats-delete-booking' },
    { event: 'app/checkpayment' },
    async ({ event, step }) => {
        const tenminutes = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('Wait-for-10-minutes', tenminutes);
        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);
            if (!booking.isPaid) {
                const show = await Show.findById(booking.show);
                booking.bookedseats.forEach((seat) => {
                    return delete show.occupiedSeats[seat];
                })
                show.markModified('occupiedSeats');
                await show.save();
                await Booking.findByIdAndDelete(booking._id)
            }
        })
    }
)

export const cleanupOldData = inngest.createFunction(
    { id: "cleanup-old-bookings-shows" },
    { cron: "0 0 1 1,7 *" }, // Runs at 00:00 on Jan 1 and Jul 1
    async ({ step }) => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        return step.run("delete-old-bookings-and-shows", async () => {
            const deletedBookings = await Booking.deleteMany({
                createdAt: { $lt: sixMonthsAgo },
            });

            const deletedShows = await Show.deleteMany({
                showDateTime: { $lt: sixMonthsAgo },
            });

            console.log(
                `Deleted ${deletedBookings.deletedCount} old bookings and ${deletedShows.deletedCount} shows.`
            );

            return {
                deletedBookings: deletedBookings.deletedCount,
                deletedShows: deletedShows.deletedCount,
            };
        });
    }
);


const sendbookingEmail = inngest.createFunction(
    { id: "send-booking-confirmation-mail" },
    { event: 'app/show.booked' },
    async ({ event }) => {
        const { bookingId } = event.data;

        try {
            console.log(`Processing email for bookingId: ${bookingId}`);
            const booking = await Booking.findById(bookingId).populate({
                path: 'show',
                populate: {
                    path: 'movie',
                    model: 'Movie'
                }
            }).populate('user');

            if (!booking || !booking.user || !booking.show || !booking.show.movie) {
                console.warn(`Booking or related data missing for booking ID ${bookingId}`);
                console.log('Booking:', !!booking);
                console.log('User:', !!booking?.user);
                console.log('Show:', !!booking?.show);
                console.log('Movie:', !!booking?.show?.movie);
                throw new Error("Missing booking data, cannot send email");
            }

            console.log(`Sending email to: ${booking.user.email}`);

            const showTime = new Date(booking.show.showDateTime).toLocaleTimeString('en-US', {
                timeZone: 'Asia/Kolkata'
            });

            const showDate = new Date(booking.show.showDateTime).toLocaleDateString('en-US', {
                timeZone: 'Asia/Kolkata'
            });

            await sendEmail({
                to: booking.user.email,
                subject: `Payment confirmation: '${booking.show.movie.originalTitle}' booked!`,
                body: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background-color: #7b2cbf; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🎟️ QuickShow Booking Confirmed!</h1>
          </div>

          <div style="padding: 24px; font-size: 16px; color: #333;">
            <h2 style="margin-top: 0;">Hi ${booking.user.name},</h2>
            <p>Your booking for <strong style="color: #7b2cbf;">"${booking.show.movie.originalTitle}"</strong> is confirmed.</p>

            <p>
              <strong>Date:</strong> ${showDate}<br>
              <strong>Time:</strong> ${showTime}
            </p>
            <p><strong>Booking ID:</strong> <span style="color: #7b2cbf;">${booking._id}</span></p>
            <p><strong>Seats:</strong> ${booking.bookedseats?.join(', ') || 'N/A'}</p>

            <p>🎬 Enjoy the show and don’t forget to grab your popcorn!</p>
          </div>
          <img src="${booking.show.movie.primaryImage}" alt="${booking.show.movie.originalTitle} Poster" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 4px; margin-top: 16px;" />

          <div style="background-color: #f5f5f5; color: #777; padding: 16px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">Thanks for booking with us!<br>— The QuickShow Team</p>
            <p style="margin: 4px 0 0;">📍 Visit us: <a href="" style="color: #7b2cbf; text-decoration: none;">QuickShow</a></p>
          </div>
        </div>`
            });
            console.log("Email function completed successfully");

        } catch (error) {
            console.error("Error in sendbookingEmail function:", error);
            throw error; // Re-throw so Inngest sees it as failed
        }
    }
);

const sendNewMovieEmail = inngest.createFunction(
    { id: 'send-new-movie-notification' },
    { event: 'app/show.added' },
    async ({ event }) => {
        const { movieId } = event.data;
        const users = await User.find({});
        const movie = await Movie.findById(movieId);

        if (!movie) return "No movie found";

        for (const user of users) {
            const userEmail = user.email;
            const userName = user.name;

            // const subject = `🎬 New Show Added: ${movie.originalTitle}`;
            // const body = `<div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            // <div style="background-color: #7b2cbf; color: white; padding: 20px; text-align: center;">
            //     <h1 style="margin: 0;">Hi ${userName},</h1>
            // </div>

            // <div style="padding: 24px; color: #333;">
            //     <h2 style="margin-top: 0;">"${movie.originalTitle}" is Now Available on QuickShow!</h2>
            //     <p><strong>Release Date:</strong> ${movie.releaseDate}</p>
            //     <p><strong>Genre:</strong> ${movie.genres.map((genre) => genre).join(', ')}</p>
            //     <p>${movie.description}</p>

            //     <img src="${movie.primaryImage}" alt="${movie.originalTitle} Poster" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 4px; margin-top: 16px;" />

            //     <div style="margin-top: 20px; text-align: center;">
            //     <a href="" style="background-color: #7b2cbf; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">🎟️ Book Your Tickets</a>
            //     </div>
            // </div>

            // <div style="background-color: #f5f5f5; color: #777; padding: 16px; text-align: center; font-size: 14px;">
            //     <p style="margin: 0;">Thanks for staying with QuickShow!<br>We bring the cinema to your fingertips.</p>
            //     <p style="margin: 4px 0 0;">📍 Visit us: <a href="" style="color: #7b2cbf; text-decoration: none;">QuickShow</a></p>
            // </div>
            // </div>`

            // ▼▼▼▼▼▼▼▼▼▼▼▼ CHANGES START HERE ▼▼▼▼▼▼▼▼▼▼▼▼
            const subject = `🎬 Now Showing: ${movie.originalTitle}`;
            const body = `
            <div style="max-width: 600px; margin: 0 auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                
                <div style="text-align: center; padding: 20px 0; background-color: #fafafa; border-bottom: 1px solid #eeeeee;">
                    <h2 style="color: #F84464; margin: 0; font-size: 24px; font-weight: bold;">QuickShow</h2>
                    <p style="color: #666; margin: 5px 0 0; font-size: 14px;">The big screen awaits you, ${userName}!</p>
                </div>

                <div style="padding: 0;">
                    <img src="${movie.primaryImage}" alt="${movie.originalTitle}" style="width: 100%; height: auto; display: block;" />
                </div>

                <div style="padding: 25px; text-align: center;">
                    <span style="background-color: #FFF0F3; color: #F84464; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Just Added</span>
                    
                    <h1 style="color: #333; margin: 15px 0 10px; font-size: 26px;">${movie.originalTitle}</h1>
                    
                    <p style="color: #666; font-size: 15px; margin: 0 0 25px; line-height: 1.6;">
                       ${movie.description ? movie.description.substring(0, 150) + '...' : 'Experience the latest blockbuster in theaters near you. Grab your popcorn and enjoy the show!'}
                    </p>

                    <div style="background-color: #F9F9F9; border-radius: 8px; padding: 15px; margin-bottom: 25px; text-align: left; display: inline-block; width: 80%;">
                        <p style="margin: 5px 0; font-size: 13px; color: #555;"><strong>📅 Release Date:</strong> ${new Date(movie.releaseDate).toDateString()}</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #555;"><strong>🎭 Genre:</strong> ${movie.genres.map((genre) => genre).join(', ')}</p>
                        <p style="margin: 5px 0; font-size: 13px; color: #555;"><strong>🌐 Language:</strong> ${movie.languages ? movie.languages.join(', ') : 'Multiple'}</p>
                    </div>

                    <div>
                        <a href="#" style="background-color: #F84464; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Book Tickets Now</a>
                    </div>
                </div>

                <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; color: #999; font-size: 12px;">You received this because you are subscribed to QuickShow updates.</p>
                    <div style="margin-top: 10px;">
                        <a href="#" style="color: #F84464; text-decoration: none; font-size: 12px; margin: 0 5px;">Unsubscribe</a>
                        <span style="color: #ccc;">|</span>
                        <a href="#" style="color: #F84464; text-decoration: none; font-size: 12px; margin: 0 5px;">Privacy Policy</a>
                    </div>
                </div>
            </div>`;
            // ▲▲▲▲▲▲▲▲▲▲▲▲ CHANGES END HERE ▲▲▲▲▲▲▲▲▲▲▲▲
            await sendEmail({
                to: userEmail,
                subject,
                body,
            })
        }
        return { message: 'Notification sent' }
    }
)


export const functions = [userCreated, userUpdated, userDeleted, releaseSeatsandDeletebooking, cleanupOldData, sendbookingEmail, sendNewMovieEmail];





// // ▼▼▼▼▼▼▼▼▼▼▼▼ CHANGES START HERE ▼▼▼▼▼▼▼▼▼▼▼▼
//             await sendEmail({
//                 to: booking.user.email,
//                 subject: `Booking Confirmed: ${booking.show.movie.originalTitle}`, // Updated Subject
//                 body: `
//                 <div style="max-width: 600px; margin: 0 auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                  
//                   <div style="text-align: center; padding: 20px 0;">
//                     <h2 style="color: #F84464; margin: 0; font-size: 24px; font-weight: bold;">QuickShow</h2>
                    
//                     <h3 style="color: #4BB543; margin: 10px 0 5px 0; font-size: 18px;">Your booking is confirmed!</h3>
//                     <p style="color: #666; margin: 0; font-size: 14px;">Booking ID <span style="font-weight: bold; color: #333;">${booking._id}</span></p>
//                   </div>

//                   <hr style="border: none; border-top: 1px dashed #cccccc; margin: 0 20px;" />

//                   <div style="padding: 20px;">
//                     <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
//                       <tr>
//                         <td width="110" valign="top" style="padding-right: 20px;">
//                           <img src="${booking.show.movie.primaryImage}" alt="Poster" style="width: 100px; height: 150px; object-fit: cover; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" />
//                         </td>
                        
//                         <td valign="top">
//                           <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #333;">${booking.show.movie.originalTitle} (UA)</h2>
                          
//                           <p style="margin: 0 0 5px 0; font-size: 14px; color: #555;">
//                             English, 2D
//                           </p>
                          
//                           <p style="margin: 0 0 5px 0; font-size: 14px; color: #555;">
//                             <strong>${showDate} | ${showTime}</strong>
//                           </p>
                          
//                           <p style="margin: 0 0 15px 0; font-size: 14px; color: #777;">
//                             QuickShow Cinemas: Audi 5
//                           </p>
                          
//                           <p style="margin: 0; font-size: 14px; color: #333;">
//                             <span style="color: #777;">Seats:</span> <strong style="font-size: 16px;">${booking.bookedseats?.join(', ') || 'N/A'}</strong>
//                           </p>
//                         </td>
//                       </tr>
//                     </table>
//                   </div>

//                   <div style="position: relative; padding: 0 20px 20px 20px;">
//                     <div style="border: 2px solid #4BB543; color: #4BB543; font-weight: bold; padding: 5px 10px; border-radius: 4px; display: inline-block; transform: rotate(-5deg); font-size: 12px; margin-left: 120px; opacity: 0.8;">
//                       BOOKING CONFIRMED
//                     </div>
                    
//                     <div style="text-align: center; margin-top: 30px;">
//                       <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
//                         Check your booking details, discounts, deals<br>and much more with your ticket
//                       </p>
//                       <a href="#" style="background-color: #F84464; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Open ticket</a>
//                     </div>
//                   </div>

//                   <div style="padding: 20px;">
//                     <div style="background-color: #000; color: #fff; padding: 15px; border-radius: 8px; text-align: left; display: flex; align-items: center; justify-content: space-between;">
//                         <div>
//                           <p style="margin: 0; color: #fbbf24; font-weight: bold;">Restaurant Deals %</p>
//                           <p style="margin: 5px 0 0 0; font-size: 14px;">Hurray! You've earned deals on top restaurants.</p>
//                         </div>
//                         <div style="font-size: 24px;">🍔</div>
//                     </div>
//                   </div>

//                   <div style="background-color: #f5f5f5; padding: 20px; text-align: left; border-top: 1px solid #eeeeee;">
//                     <h4 style="margin: 0 0 10px 0; color: #555; font-size: 12px; text-transform: uppercase;">Important Instructions</h4>
//                     <ul style="margin: 0; padding-left: 20px; color: #777; font-size: 11px; line-height: 1.6;">
//                       <li>This transaction can be cancelled up to 20 min(s) before the show.</li>
//                       <li>The Credit Card/Holder must be present at the ticket counter while collecting tickets.</li>
//                       <li>GST collected is paid to the department.</li>
//                     </ul>
                    
//                     <div style="text-align: center; margin-top: 20px;">
//                         <p style="font-size: 12px; color: #999;">Sent by QuickShow Team</p>
//                     </div>
//                   </div>
//                 </div>`
//             });
//             // ▲▲▲▲▲▲▲▲▲▲▲▲ CHANGES END HERE ▲▲▲▲▲▲▲▲▲▲▲▲