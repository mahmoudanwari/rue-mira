import { Confirmation } from "@/components/checkout/Confirmation";
import { simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/order-confirmation/", (t) => t.confirmation.title, { noindex: true });

export default function OrderConfirmationPage() {
  return (
    <div className="container-rm mt-10">
      <Confirmation />
    </div>
  );
}
