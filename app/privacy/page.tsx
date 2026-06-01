import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Privacy Policy — EverGreen",
  description: "How EverGreen collects, uses, and protects your personal data in Armenia.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 2026"
      intro="This Policy explains how EverGreen collects, uses, and protects your personal data when you use our website or engage our services in Armenia. We aim to keep it plain and honest."
      sections={[
        {
          heading: "What we collect",
          body: [
            "When you submit a contact form, viewing request, or newsletter signup, we collect the details you provide — typically your name, email, phone, and your message or preferences.",
            "Like most websites, we also collect limited technical data (such as device and usage information) to keep the site secure and improve it.",
          ],
        },
        {
          heading: "How we use it",
          body: [
            "We use your information to respond to enquiries, arrange viewings, send the newsletter you asked for, and provide our advisory services. We do not sell your personal data.",
            "Newsletter emails are sent only after you opt in, and every email includes an unsubscribe option.",
          ],
        },
        {
          heading: "Cookies & local storage",
          body: [
            "We use a small amount of browser storage to remember your preferences — such as your chosen currency (AMD/USD), light or dark theme, saved and recently-viewed properties, and your cookie choice. These stay on your device.",
            "You can accept or decline non-essential cookies via the banner, and clear them any time in your browser settings.",
          ],
        },
        {
          heading: "Who we share it with",
          body: [
            "We share data only with trusted service providers who help us operate — for example, our hosting and database providers — and only as needed to deliver the service. They are bound to protect your data.",
          ],
        },
        {
          heading: "Data retention & security",
          body: [
            "We keep your information only as long as needed for the purpose it was collected, then delete or anonymise it. We use reasonable technical and organisational measures to protect it.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "Under Armenian data-protection law you may request access to, correction of, or deletion of your personal data. To exercise these rights, email hello@evergreen.am and we'll respond promptly.",
          ],
        },
      ]}
    />
  );
}
