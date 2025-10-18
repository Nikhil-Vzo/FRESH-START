import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types";
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
                        bookingDetails.transaction_id = paymentData.transactionId;

                        const { data: newBooking, error } = await supabase.from('bookings').insert(bookingDetails).select().single();
                        if (error) throw new Error(`Payment succeeded, but failed to save booking: ${error.message}`);
                        
                        recordToEmail = newBooking; // The record we want to email
                        localStorage.removeItem(`pending_booking_${merchantTransactionId}`);
                        setMessage("Your booking is confirmed! Sending email...");
                        toast.success("Booking successful!");

                    } else if (pendingDonationJSON) {
                        // ... donation logic remains the same ...
                        localStorage.removeItem(`pending_donation_${merchantTransactionId}`);
                        setStatus('success');
                        setMessage("Thank you for your generous donation!");
                        toast.success("Donation recorded successfully!");
                        return; // No email for donation for now
                    } else {
                        throw new Error("Payment successful, but pending transaction data was not found.");
                    }

                    // 2. If we have a record (a booking), call the Edge Function directly
                    if (recordToEmail) {
                        console.log("Calling Edge Function with record:", recordToEmail);
                        const emailResponse = await fetch(
                            `https://lehpiptexuxbnxgdunmc.supabase.co/functions/v1/send-booking-email-secure?secret=${EMAIL_WEBHOOK_SECRET}`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ record: recordToEmail })
                            }
                        );

                        if (!emailResponse.ok) {
                            const errorBody = await emailResponse.text();
                            throw new Error(`Booking saved, but email failed: ${errorBody}`);
                        }

                        console.log("Email function called successfully.");
                        setMessage("Booking confirmed and confirmation email sent!");
                    }
                    
                    setStatus('success');

                } else {
                    // Payment failed logic
                    localStorage.removeItem(`pending_booking_${merchantTransactionId}`);
                    localStorage.removeItem(`pending_donation_${merchantTransactionId}`);
                    setStatus('failed');
                    setMessage(response.data.message || "The payment was not successful.");
                    toast.error("Payment failed or was cancelled.");
                }
            } catch (error: any) {
                console.error("Error finalizing transaction:", error);
                localStorage.removeItem(`pending_booking_${merchantTransactionId}`);
                localStorage.removeItem(`pending_donation_${merchantTransactionId}`);
                setStatus('failed');
                setMessage(error.message);
                toast.error("An unexpected error occurred.");
            }
        };

        setTimeout(finalizeTransaction, 3000); 

    }, [merchantTransactionId]);

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

                {status === 'success' && (
                    <>
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
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