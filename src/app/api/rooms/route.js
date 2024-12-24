import { supabase } from "@/app/supabase";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    // Fetch room data along with the associated crew data
    const { data, error } = await supabase
      .from("Rooms")
      .select("*, Crew(*)") // Adjust the select statement if needed
      .order("room_no"); // Orders rooms based on room number

    // If there is an error fetching the data
    if (error) {
      console.error("Error fetching room data:", error.message);
      return NextResponse.json(
        { message: "Error fetching room data", error: error.message },
        { status: 500 }
      );
    }

    // Return the fetched data as a JSON response
    return NextResponse.json(data);
  } catch (err) {
    // Catch any other errors and return a response
    console.error("Unexpected error:", err.message);
    return NextResponse.json(
      { message: "Unexpected error", error: err.message },
      { status: 500 }
    );
  }
};
