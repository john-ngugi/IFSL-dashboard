import MapView from "../ui/Map";
import Navigation from "../ui/Navigation";

const Dashboard: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-50">
      <Navigation />

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapView />
      </div>
    </div>
  );
};

export default Dashboard;
