import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function DataStats() {
  const [inquiryData, setInquiryData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const userReference = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userReference);

        if (userSnapshot.exists()) {
          setInquiryData(userSnapshot.data().inquiryData ?? {});
        }
      } catch (error) {
        console.error("Failed to load inquiry data:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return <p>Loading statistics...</p>;
  }

  return (
    <>
      <h1>Data Statistics</h1>
      <p>Age range: {inquiryData.ageRange || "Not provided"}</p>
    </>
  );
}

export default DataStats;