import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SignupBody } from "@/components/signup/SignupBody";

export const metadata = {
  title: "Sign Up — EverGreen",
  description:
    "Join EverGreen — save listings, get curated matches, and book private viewings, all in one calm place.",
};

export default function SignupPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: "var(--header-h)" }}>
        <SignupBody />
      </main>
      <Footer />
    </>
  );
}
