import React, { useEffect, useState } from "react";

const NotFound: React.FC = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          window.location.href = "https://cat.vexide.dev";
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Oops! The page you were trying to go to doesn't exist.</h1>
      <p className="text-3xl font-serif mt-10 height-5 text-accent">
        <em>But</em> we know where you might have been trying to go.
        <br />
        Redirecting in {countdown}...
      </p>
    </div>
  );
};

export default NotFound;
