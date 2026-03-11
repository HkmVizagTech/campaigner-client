import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDonorDetailsObj } from "@/store/Donations/donations.service";
import api from "@/api/api";

const templeQuotes = [
  {
    quote: "Whatever you give in charity, do that as an offering unto Me.",
    author: "Bhagavad-Gita 9.27",
  },
  {
    quote:
      "One who builds a temple for Lord Krishna lives eternally in the spiritual world.",
    author: "Padma Purana",
  },
  {
    quote:
      "By serving the Lord and helping others serve Him, one attains the highest perfection.",
    author: "Srila Prabhupada",
  },
  {
    quote:
      "The construction of a temple creates a place where thousands can remember Krishna.",
    author: "Srila Prabhupada",
  },
];

export default function ThankYouPage() {
  const { getDonorDetailsLoading: loading, donorDetailsObj: donation } =
    useSelector((state) => state.donation);
  const [downloading, setDownloading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const randomQuote =
    templeQuotes[Math.floor(Math.random() * templeQuotes.length)];

  useEffect(() => {
    if (!id) {
      navigate("*");
      return;
    }

    const fetchDonor = async () => {
      try {
        await dispatch(getDonorDetailsObj(id)).unwrap();
      } catch {
        navigate("*");
      }
    };

    fetchDonor();
  }, [id, dispatch, navigate]);

  if (loading) return <ThankYouSkeleton />;

  const handleDownloadReceipt = async () => {
    try {
      setDownloading(true);

      const response = await api.get(`/receipt/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `receipt-${donation?.receiptNumber || id}.pdf`,
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download receipt", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-14 w-14 text-primary" />
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold">
            Hare Krishna 🙏
          </h1>

          <p className="text-primary font-medium text-lg">
            Thank you for your generous contribution
          </p>

          <p className="text-muted-foreground text-sm">
            Your donation supports the sacred mission of building a temple for
            Lord Krishna and spreading Krishna consciousness.
          </p>
        </div>

        {/* SEVA CARD */}
        {donation?.seva && (
          <Card className="rounded-2xl border shadow-sm py-0">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">
                {donation?.seva?.sevaName}
              </h2>

              <ul className="space-y-2 text-sm text-muted-foreground">
                {donation?.seva?.sevaPoints?.map((point, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* QUOTE */}
        <Card className="rounded-2xl border shadow-sm py-0">
          <CardContent className="p-6 text-center space-y-3">
            <p className="italic text-muted-foreground">
              “{randomQuote?.quote}”
            </p>

            <p className="text-sm text-primary font-semibold">
              — {randomQuote?.author}
            </p>
          </CardContent>
        </Card>

        {/* AMOUNT */}
        <div className="rounded-2xl bg-primary text-primary-foreground text-center py-6 shadow-md">
          <p className="uppercase text-xs tracking-wider opacity-80">
            Donation Amount
          </p>

          <p className="text-4xl font-bold mt-2">
            ₹{donation?.amount?.toLocaleString("en-IN")}
          </p>

          <p className="text-sm mt-3 opacity-90">
            May Lord Krishna bless you abundantly
          </p>
        </div>

        {/* PAYMENT DETAILS */}
        <Card className="rounded-2xl border shadow-sm py-0">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6">Payment Details</h3>

            <div className="divide-y">
              <DetailRow
                label="Transaction ID"
                value={donation?.gatewayPaymentId}
              />

              <DetailRow label="Donor Name" value={donation?.donorName} />

              <DetailRow label="Email" value={donation?.donorEmail ?? "N/A"} />

              <DetailRow
                label="Payment Method"
                value={donation?.paymentGateway}
              />

              <DetailRow
                label="Date"
                value={new Date(donation?.createdAt)?.toLocaleDateString(
                  "en-IN",
                )}
              />

              {donation?.address && <AddressRow address={donation?.address} />}
            </div>

            {/* PRASADAM NOTICE */}
            {donation?.isEligibleForPrasadam && (
              <div className="mt-6 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                📦 Sacred Prasadam will be delivered to this address as a
                blessing for your contribution. Delivery may take up to 30 days
                within India.
              </div>
            )}

            <div className="mt-6 pt-6 border-t flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount</span>

              <span className="text-2xl font-bold text-primary">
                ₹{donation?.amount?.toLocaleString("en-IN")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={handleDownloadReceipt}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              "Download Receipt"
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => navigate(-1)}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="py-4 flex flex-col sm:flex-row sm:justify-between gap-1">
      <span className="text-muted-foreground text-sm">{label}</span>

      <span className="font-medium text-sm sm:text-base text-right break-all">
        {value}
      </span>
    </div>
  );
}

function AddressRow({ address }) {
  return (
    <div className="py-4 flex flex-col sm:flex-row sm:justify-between gap-2">
      <span className="text-muted-foreground text-sm">Delivery Address</span>

      <div className="text-sm text-right leading-relaxed">
        {address.fullAddress && <div>{address.fullAddress}</div>}
        {address.city && <div>{address.city}</div>}
        {(address.state || address.pincode) && (
          <div>
            {address.state} {address.pincode && `- ${address.pincode}`}
          </div>
        )}
      </div>
    </div>
  );
}

function ThankYouSkeleton() {
  return (
    <div className="min-h-screen flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />

        <Skeleton className="h-8 w-60 mx-auto" />

        <Skeleton className="h-4 w-96 mx-auto" />

        <Skeleton className="h-28 rounded-xl" />

        <Skeleton className="h-24 rounded-xl" />

        <Skeleton className="h-52 rounded-xl" />

        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
