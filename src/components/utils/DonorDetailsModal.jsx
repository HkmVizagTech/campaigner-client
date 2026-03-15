import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DonorDetailsModal({ donor, onClose }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Donor Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Detail label="Donor Name" value={donor?.donorName ?? "N/A"} />
          <Detail label="Phone" value={donor?.donorPhone ?? "N/A"} />
          <Detail
            label="Donation Date"
            value={new Date(donor.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
          <Detail
            label="Amount"
            value={`₹${donor?.amount?.toLocaleString("en-IN")}`}
          />
          <Detail label="Status" value={donor?.status} />
          {donor?.address?.fullAddress && (
            <Detail label="Address" value={donor?.address?.fullAddress} />
          )}

          {donor?.address?.city && (
            <Detail label="City" value={donor?.address?.city} />
          )}
          {donor?.address?.state && (
            <Detail label="State" value={donor?.address?.state} />
          )}
          {donor?.address?.pincode && (
            <Detail label="Pincode" value={donor?.address?.pincode} />
          )}

          <Detail label="Payment Gateway" value={donor?.paymentGateway} />
          <Detail label="Campaign" value={donor?.campaign?.title} />
          <Detail
            label="Campaign Target"
            value={
              `₹${donor?.campaign?.targetAmount?.toLocaleString("en-IN")}` ??
              "N/A"
            }
          />
          <Detail label="Campaigner" value={donor?.campaigner?.name ?? "N/A"} />
          <Detail
            label="Temple Devote In Touch"
            value={donor?.campaigner?.templeDevoteInTouch?.devoteName ?? "N/A"}
          />
          <Detail
            label="Devote Phone"
            value={donor?.campaigner?.templeDevoteInTouch?.phoneNumber ?? "N/A"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}
