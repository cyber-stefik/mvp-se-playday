import { useContext, useEffect, useState } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { AuthContext } from "@/components/context/auth-provider";

interface Booking {
  id: string;
  fieldName: string;
  location: string;
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  priceToPay: number | null;
  renter: string;
}

function Bookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        let userHash = user.uid;

        const fieldsQuery = query(
          collection(firestore, "fields"),
          where("owner", "==", userHash)
        );
        const fieldsSnapshot = await getDocs(fieldsQuery);

		console.log(fieldsSnapshot.docs);

        const ownedFields = fieldsSnapshot.docs.map((doc) => ({
          fieldName: doc.data().fieldName,
          location: doc.data().location,
        }));

        if (ownedFields.length === 0) {
          console.log("No fields owned by the user.");
          setBookings([]);
          setLoading(false);
          return;
        }

        const rentalSnapshot = await getDocs(collection(firestore, "rentals"));
        const matchedBookings: Booking[] = rentalSnapshot.docs
          .filter((doc) => {
            const rental = doc.data();
            return ownedFields.some(
              (field) =>
                field.fieldName === rental.fieldName &&
                field.location === rental.location
            );
          })
          .map((doc) => {
            const rental = doc.data();
            return {
              id: doc.id,
              fieldName: rental.fieldName,
              location: rental.location,
              startDate: rental.startDate || null,
              endDate: rental.endDate || null,
              priceToPay: rental.priceToPay || null,
			  renter: rental.owner
            } as Booking;
          });

        setBookings(matchedBookings);
		console.log(matchedBookings)
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-2xl font-bold text-[#065C64]">Bookings for your field</h1>
      </div>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found for your fields.</p>
      ) : (
        <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-[#065C64] mb-2">
                {booking.fieldName}
              </h2>
              <p className="text-gray-600">Location: {booking.location}</p>
              <p className="text-gray-600">
                Start: {booking.startDate?.toDate().toLocaleString() || "N/A"}
              </p>
              <p className="text-gray-600">
                End: {booking.endDate?.toDate().toLocaleString() || "N/A"}
              </p>
              <p className="text-gray-600">
                Price: ${booking.priceToPay !== null ? booking.priceToPay : "N/A"}
              </p>
			  <p>
				Rented by: {booking.renter}
			  </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
