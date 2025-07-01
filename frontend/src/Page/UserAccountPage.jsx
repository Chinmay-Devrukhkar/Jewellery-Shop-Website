import React, { useEffect } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  ShoppingBag, 
  Heart, 
  Edit,
  ChevronRight,
  LogOut
} from 'lucide-react';
import Header from '../Components/Header';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

const UserAccountPage = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    isLoading, 
    logout, 
    fetchUserData 
  } = useUser();

  useEffect(() => {
    // If authentication state has been determined
    if (!isLoading) {
      // Redirect unauthenticated users to login
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      
      // Redirect admins to admin dashboard
      if (isAdmin) {
        navigate("/admin");
        return;
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin && !user) {
      fetchUserData();
    }
  }, [isLoading, isAuthenticated, isAdmin, user, fetchUserData]);

  // Function to get user initials from fullName
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto p-4 text-center">Loading...</div>;
  }

  return (
    <>
    <Header />
    <Navbar />
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Account</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 border-none bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'rgba(200, 160, 85, 0.2)' }}>
              <span className="text-2xl font-bold" style={{ color: '#C8A055' }}>
                {getInitials(user?.fullName || user?.full_name)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.fullName || user?.full_name}</h2>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
          <InfoItem icon={<User />} label="Full Name" value={user?.fullName || user?.full_name} />
          <InfoItem icon={<Phone />} label="Mobile" value={user?.contactNo || user?.contact_no} />
          <InfoItem icon={<MapPin />} label="Address" value={user?.address} />
          <InfoItem icon={<Mail />} label="Email" value={user?.email} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NavLink to='/user/orders' style={{all:'unset'}}>
          <ActionCard 
            icon={<ShoppingBag/>}
            title="Order History"
            description="View your past orders and track current orders"
          />
        </NavLink>
        <NavLink to='/user/wishlist' style={{all:'unset'}}>
        <ActionCard 
          icon={<Heart />}
          title="Wishlist"
          description="Products you've saved for later"
        />
        </NavLink>
        <NavLink to='/user/edit' style={{all:'unset'}}>
          <ActionCard 
            icon={<Edit />}
            title="Edit Profile"
            description="Update your Profile Information"
          />
        </NavLink>
      </div>

      {/* Additional Logout Button (Mobile-friendly placement at bottom) */}
      <div className="md:hidden">
        <button 
          onClick={handleLogout}
          className="btn w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
    <Footer />
    </>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="text-gray-400">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const ActionCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(200, 160, 85, 0.1)' }}>
            <div style={{ color: '#C8A055' }}>
              {icon}
            </div>
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <ChevronRight style={{ color: '#C8A055' }} />
      </div>
    </div>
  </div>
);

export default UserAccountPage;