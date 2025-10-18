import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types"; // <<< Removed TablesUpdate
import { toast } from "sonner";

// Get the secret from the environment variables
const EMAIL_WEBHOOK_SECRET = import.meta.env.VITE_EMAIL_WEBHOOK_SECRET;

const PaymentStatus = () => {
    const { merchantTransactionId } = useParams();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState("Finalizing your transaction...");
    const [transactionDetails, setTransactionDetails] = useState<any>(null);

    useEffect(() => {
        if (!merchantTransactionId) {
            setStatus('failed');
            setMessage("No transaction ID found.");
            return;
        }

        const finalizeTransaction = async () => {
            let bookingId: number | null = null;
            // <<< REMOVED emailStatus variable

            try {
                // 1. Check payment status with the backend
                const response = await axios.get(`http://localhost:3001/api/payment/status/${merchantTransactionId}`);
                
                if (response.data.success && response.data.code === 'PAYMENT_SUCCESS') {
                    const paymentData = response.data.data;
                    setTransactionDetails(paymentData);

                    const pendingBookingJSON = localStorage.getItem(`pending_booking_${merchantTransactionId}`);
                    const pendingDonationJSON = localStorage.getItem(`pending_donation_${merchantTransactionId}`);

                    let recordToEmail: any = null;

                    if (pendingBookingJSON) {
                        setMessage("Payment successful! Saving your booking...");
                        
                        const bookingDetails: TablesInsert<"bookings"> = JSON.parse(pendingBookingJSON);
                        
                        // 1.1. Prepare insert data with initial tracking status (only is_ticket_active remains)
                        const insertData = {
                            ...bookingDetails,
                            transaction_id: paymentData.transactionId,
                            is_ticket_active: true, // <<< KEPT
                        };

                        // 1.2. Save booking to the database
                        const { data: newBooking, error: insertError } = await supabase
                            .from('bookings')
                            .insert(insertData)
                            .select()
                            .single();
                            
                        if (insertError) {
                             console.error("Failed to save booking to DB:", insertError);
                             setMessage(`Payment successful, but failed to save booking to the database: ${insertError.message}`);
                             setStatus('partial_success');
                        } else {
                            // Booking saved successfully - set ID for later use
                            bookingId = newBooking.id;
                            recordToEmail = newBooking; 
                            localStorage.removeItem(`pending_booking_${merchantTransactionId}`);
                            setMessage("Your booking is confirmed! Sending email...");
                            toast.success("Booking successful!");
                            setStatus('success');
                        }

                    } else if (pendingDonationJSON) {
                        setMessage("Payment successful! Saving your donation...");
                        
                        const donationDetails: TablesInsert<"donations"> = JSON.parse(pendingDonationJSON);
                        
                        const { error: donationError } = await supabase.from('donations').insert({
                            ...donationDetails,
                            transaction_id: paymentData.transactionId,
                        });
                        
                        if (donationError) throw new Error(`Payment succeeded, but failed to save donation: ${donationError.message}`);

                        localStorage.removeItem(`pending_donation_${merchantTransactionId}`);
                        setStatus('success');
                        setMessage("Thank you for your generous donation!");
                        toast.success("Donation recorded successfully!");
                        return; 
                        
                    } else {
                        setStatus('success');
                        setMessage("Payment confirmed, but details not found on this device. Check your email or profile!");
                        toast.success("Payment confirmed!");
                        return;
                    }

                    // 2. Call the secure Edge Function (for bookings only)
                    if (recordToEmail && bookingId) {
                        try {
                            const emailResponse = await fetch(
                                `https://lehpiptexuxbnxgdunmc.supabase.co/functions/v1/send-booking-email-secure?secret=${EMAIL_WEBHOOK_SECRET}`,
                                {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ record: recordToEmail })
                                }
                            );

                            if (!emailResponse.ok) {
                                // Email failure is now reported in the client message but NOT logged to DB
                                const errorBody = await emailResponse.json().catch(() => ({ message: "Unknown email server error" }));
                                throw new Error(JSON.stringify(errorBody.message || errorBody));
                            }
                            
                            setMessage("Booking confirmed and confirmation email sent!");

                        } catch (emailError: any) {
                            // Email failed. Report to the user, but still consider the booking a success.
                            const failMessage = `Booking confirmed, but email delivery may have failed. Check profile for ticket.`;
                            console.error(`Email failed: ${emailError.message}`);
                            setMessage(failMessage);
                            setStatus('partial_success');
                        }
                        
                        // <<< REMOVED Final DB Update (Step 3 in previous logic) since there are no more fields to update.
                    }
                    
                } else {
                    // Payment failed logic
                    localStorage.removeItem(`pending_booking_${merchantTransactionId}`);
                    localStorage.removeItem(`pending_donation_${merchantTransactionId}`);
                    setStatus('failed');
                    setMessage(response.data.message || "The payment was not successful.");
                    toast.error("Payment failed or was cancelled.");
                }
            } catch (error: any) {
                // This catch block handles payment status check failure, initial DB insert failure, or an uncaught error.
                console.error("Error finalizing transaction:", error);
                
                if (!bookingId) {
                    localStorage.removeItem(`pending_booking_${merchantTransactionId}`);
                    localStorage.removeItem(`pending_donation_${merchantTransactionId}`);
                }
                
                setStatus('failed');
                setMessage("An unexpected error occurred during transaction finalization.");
                toast.error("An unexpected error occurred.");
            }
        };

        // Give a short delay before checking status
        setTimeout(finalizeTransaction, 3000); 

    }, [merchantTransactionId]);

    // Added 'partial_success' status to the render logic
    const isSuccess = status === 'success' || status === 'partial_success';

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center">
            <div className="text-center card-glow p-8 max-w-md mx-auto">
                {status === 'processing' && (
                    <>
                        <ClockIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-spin" />
                        <h1 className="text-2xl font-bold mb-4">Processing Transaction...</h1>
                        <p>{message}</p>
                    </>
                )}

                {isSuccess && (
                    <>
                        <CheckCircleIcon className={`h-16 w-16 mx-auto mb-4 ${status === 'success' ? 'text-green-500' : 'text-yellow-500'}`} />
                        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
                        <p className="text-muted-foreground mb-6">{message}</p>
                        {transactionDetails && (
                            <div className="text-left text-sm space-y-2 mb-6 bg-muted/50 p-4 rounded-lg">
                                <p><strong>Transaction ID:</strong> <span className="font-mono">{transactionDetails.transactionId}</span></p>
                                <p><strong>Amount Paid:</strong> ₹{transactionDetails.amount / 100}</p>
                            </div>
                        )}
                        <Link to="/">
                            <Button>Go to Home</Button>
                        </Link>
                    </>
                )}

                {status === 'failed' && (
                     <>
                        <XCircleIcon className="h-16 w-16 text-destructive mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-4">Transaction Failed</h1>
                        <p className="text-muted-foreground mb-6">{message}</p>
                        <Link to="/">
                           <Button variant="outline">Back to Home</Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;