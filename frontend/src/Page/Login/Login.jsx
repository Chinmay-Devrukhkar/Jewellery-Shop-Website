import React, { useState, useEffect } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import './Login.css';
import Header from "../../Components/Header";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer/Footer";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext"; // Import the user context hook

function Login() {
    const navigate = useNavigate();
    const [isTab, setIsTab] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNo: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Use the UserContext
    const { login, signup, isAuthenticated, isAdmin, isLoading, error: contextError } = useUser();

    // Redirect if already authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            if (isAdmin) {
                navigate("/admin");
            } else {
                navigate("/user");
            }
        }
    }, [isAuthenticated, isAdmin,isLoading, navigate]);

    // Update local error state if context error changes
    useEffect(() => {
        if (contextError) {
            setError(contextError);
        }
    }, [contextError]);

    function handleChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError("");

        // Client-side validation
        if (isTab) { // Login form
            if (!formData.email || !formData.password) {
                setError("All fields are required");
                setLoading(false);
                return;
            }
            
            try {
                // Use login function from context instead of fetch
                const result = await login(formData.email, formData.password);
                
                if (!result.success) {
                    setError(result.error || "Login failed. Please try again.");
                }
                // No need to handle navigation, useEffect will do it based on auth state
            } catch (error) {
                console.error("Error:", error);
                setError("Server error. Please try again later.");
            } finally {
                setLoading(false);
            }
            
        } else { // Signup form
            if (!formData.email || !formData.password || !formData.fullName || !formData.phoneNo || !formData.confirmPassword) {
                setError("All fields are required");
                setLoading(false);
                return;
            }
            
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match!");
                setLoading(false);
                return;
            }
            
            if (formData.password.length < 8) {
                setError("Password must be at least 8 characters");
                setLoading(false);
                return;
            }
            
            try {
                // Use signup function from context instead of fetch
                const userData = {
                    email: formData.email,
                    password: formData.password,
                    full_name: formData.fullName,
                    phone: formData.phoneNo
                };
                
                const result = await signup(userData);
                
                if (!result.success) {
                    setError(result.error || "Signup failed. Please try again.");
                }
                // No need to handle navigation, useEffect will do it based on auth state
            } catch (error) {
                console.error("Error:", error);
                setError("Server error. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
    }

    function handleClick() {
        setIsTab(!isTab);
        setError(""); // Clear errors when switching tabs
        // Clear form data when switching tabs
        setFormData({
            email: "",
            password: "",
            fullName: "",
            phoneNo: "",
            confirmPassword: ""
        });
    }

    return (
        <>
        <Header />
        <Navbar />

        <div className="login-container">
            <div className="login">
                <div className="form-toggle">
                    <button className={isTab ? 'active' : ''} onClick={handleClick}>Login</button>
                    <button className={!isTab ? 'active' : ''} onClick={handleClick}>SignUp </button>
                </div>
                {isTab ? (
                    <div className="form">
                        <h2>Login Form</h2>
                        {error && <p className="error text-red-600">{error}</p>}
                        <input 
                            type="text" 
                            name="email" 
                            placeholder="Email Address" 
                            value={formData.email}
                            onChange={handleChange} 
                        />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password}
                            onChange={handleChange} 
                        />
                        {/* <a href="#" className='hover:text-[#C8A055]'>Forgot Password ?</a> */}
                        <button onClick={handleSubmit} disabled={loading || isLoading} className="btn ">
                            {(loading || isLoading) ? "Processing..." : "Login"}
                        </button>
                        <p className="separator">OR</p>
                        {/* <button className="btn"><GoogleIcon /> Login with Google</button> */}
                        <p>New User? <a href="#" className='hover:text-[#C8A055]' onClick={handleClick}>SignUp Now</a></p>
                    </div>
                ) : (
                    <div className="form">
                        <h2>SignUp Form</h2>
                        {error && <p className="error text-red-600">{error}</p>}
                        <input 
                            type="text" 
                            name="email" 
                            placeholder="Email Address" 
                            value={formData.email}
                            onChange={handleChange} 
                        />
                        <div className="form-group">
                            <input 
                                type="text" 
                                name="fullName" 
                                placeholder="Full Name" 
                                value={formData.fullName}
                                onChange={handleChange} 
                            />
                            <input 
                                type="tel" 
                                name="phoneNo" 
                                placeholder="Phone Number" 
                                pattern="^\d{10}$" 
                                value={formData.phoneNo}
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Password" 
                                value={formData.password}
                                onChange={handleChange} 
                            />
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                placeholder="Confirm Password" 
                                value={formData.confirmPassword}
                                onChange={handleChange} 
                            />
                        </div>
                        <button onClick={handleSubmit} disabled={loading || isLoading} className="btn ">
                            {(loading || isLoading) ? "Processing..." : "SignUp"}
                        </button>
                        <p className="separator">OR</p>
                        {/* <button className="btn"><GoogleIcon /> Login with Google</button> */}
                        <p>Already a User? <a href="#" className='hover:text-[#C8A055]' onClick={handleClick}>Login Now</a></p>
                    </div>
                )}
            </div>
        </div>
        
        <Footer />
        </>
    );
}

export default Login;