import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Components/Header'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer/Footer'
import { useUser } from '../Context/UserContext'

const EditProfile = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    isLoading,
    updateProfile,
    fetchUserData 
  } = useUser();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNo: '',
    email: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ message: '', isError: false });

  // Redirect unauthenticated users or admins
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (isAdmin) {
        navigate("/admin");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  // Fetch user data if needed
  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin && !user) {
      fetchUserData();
    }
  }, [isLoading, isAuthenticated, isAdmin, user, fetchUserData]);

  // Set form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || user.fullName || '',
        phoneNo: user.contact_no || user.contactNo || '',
        email: user.email || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validate = () => {
    let tempErrors = {};
    
    if (!formData.fullName) tempErrors.fullName = "Name is required";
    if (!formData.phoneNo) tempErrors.phoneNo = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phoneNo)) tempErrors.phoneNo = "Please enter a valid 10-digit phone number";
    
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Please enter a valid email address";
    
    if (!formData.address) tempErrors.address = "Address is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitStatus({ message: 'Updating profile...', isError: false });
      
      // Prepare data for backend using the naming convention expected by the API
      const updateData = {
        full_name: formData.fullName,
        contact_no: formData.phoneNo,
        email: formData.email,
        address: formData.address
      };
      
      // Use updateProfile from context instead of direct fetch
      const result = await updateProfile(updateData);
      
      if (result.success) {
        setSubmitStatus({ message: 'Profile updated successfully!', isError: false });
        // Redirect to user account page after successful update
        setTimeout(() => {
          navigate('/user');
        }, 1500);
      } else {
        setSubmitStatus({ 
          message: `Failed to update profile: ${result.error}`, 
          isError: true 
        });
      }
    }
  };

  const handleCancel = () => {
    navigate('/user');
  };

  if (isLoading) {
    return (
      <>
        <Header/>
        <Navbar/>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-lg">Loading user data...</p>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <Header/>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-stone-800 text-center tracking-wider py-3">Edit Profile</h2>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {submitStatus.message && (
              <div className={`mb-4 p-3 rounded-md ${submitStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>
              
              <div>
                <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNo"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.phoneNo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="1234567890"
                />
                {errors.phoneNo && <p className="mt-1 text-sm text-red-600">{errors.phoneNo}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                  placeholder="123 Main St, City, State, ZIP"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
              
              <div>
                <button
                  type="submit"
                  className="btn w-full flex justify-center py-2 px-4 border-none rounded-md shadow-sm text-sm font-medium text-white bg-[#C8A055] hover:bg-[#bf8a28]"
                >
                  Save Changes
                </button>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn w-full flex justify-center py-2 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm px-4 border-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default EditProfile;