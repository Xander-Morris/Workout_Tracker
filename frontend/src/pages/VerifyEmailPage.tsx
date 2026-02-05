import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiClient } from "../lib/apiclient";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState("Verifying...");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
        try {
            const response = await apiClient.get("/auth/authenticate", {
                params: { token, email }
            });

            if (response.status === 200) {
                setStatus("Email verified successfully! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setStatus("Verification failed. Please try again.");
            }
        } catch (error) {
            console.error("Verification error:", error);
            setStatus("Verification failed. Please try again.");
        }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{status}</p>
    </div>
  );
};

export default VerifyEmailPage;