import { Navbar } from "@/components/navbar";

export default function Home() {
  const currentUserName = "Amandeep Mandal";
  return (
    <div className="min-h-screen bg-gray-600">
      <Navbar username={currentUserName} />

      <main>Welcome to TaskFlow</main>
    </div>
  );
}
