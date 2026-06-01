import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Terms & Conditions — EverGreen",
  description: "The terms governing your use of the EverGreen website and services in Armenia.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="June 2026"
      intro="These Terms govern your use of the EverGreen website and the property advisory services we provide in Armenia. By using our site or engaging our team, you agree to these Terms."
      sections={[
        {
          heading: "About EverGreen",
          body: [
            "EverGreen is a boutique real-estate advisory based in Yerevan, Armenia, assisting clients with buying, selling, and renting residential property across the country.",
            "Our registered office is 12 Northern Avenue, Yerevan 0001, Armenia. You can reach us at hello@evergreen.am.",
          ],
        },
        {
          heading: "Property information",
          body: [
            "Listings, prices, dimensions, and images are provided for general guidance and may change without notice. While we take care to keep details accurate, we do not warrant that every listing is current, error-free, or available at the time of enquiry.",
            "Prices shown in Armenian Dram (AMD) are converted from USD at an indicative rate for display only; the binding price is agreed in writing for each transaction.",
          ],
        },
        {
          heading: "Enquiries and viewings",
          body: [
            "When you submit an enquiry, viewing, or tour request, you authorise us to contact you about that property and related services. Requested dates and times are preferences, not confirmed bookings, until an advisor confirms them.",
          ],
        },
        {
          heading: "Your account",
          body: [
            "If you create an account, you are responsible for keeping your credentials secure and for activity under your account. You agree to provide accurate information and to use the site lawfully.",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "The EverGreen name, brand, site design, and original content are owned by EverGreen and may not be copied or reused without permission. Property photography may be licensed from third parties and is used for illustration.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "To the extent permitted by Armenian law, EverGreen is not liable for indirect or consequential losses arising from use of the site. Nothing in these Terms limits liability that cannot be limited by law.",
          ],
        },
        {
          heading: "Governing law",
          body: [
            "These Terms are governed by the laws of the Republic of Armenia, and any disputes will be subject to the jurisdiction of the courts of Yerevan.",
          ],
        },
      ]}
    />
  );
}
