import React, { useEffect } from 'react';
import axios from 'axios';

const OtpAuth = () => {
  useEffect(() => {
    // Dynamically load the external script
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://www.phone.email/sign_in_button_v1.js';
      script.async = true;
      document.body.appendChild(script);

      // Define the phoneEmailListener function
      window.phoneEmailListener = (userObj) => {
        const { user_json_url } = userObj;

        // Send the JSON URL to your backend
        axios
          .post('https://vehicle-detection-app-3j4y.onrender.com/api/verify-phone', { user_json_url })
          .then((response) => {
            alert(`Phone verification successful! Welcome, ${response.data.user_first_name}!`);
          })
          .catch((error) => {
            console.error('Error during verification:', error);
          });
      };
    };

    loadScript();
  }, []);

  return (
    <div className="container">
      <div className="pe_signin_button " data-client-id="12750965998861757266"></div>
    </div>
  );
};

export default OtpAuth;
