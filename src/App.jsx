import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://jcgxviclxxfsonnjxjih.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZ3h2aWNseHhmc29ubmp4amloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5Mzg0NTUsImV4cCI6MjA1NjUxNDQ1NX0.ZCwwUcqcWP34Wm8qMSO47vVhoyk_6dFPKVB3gvSHBKE");

function App() {
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const { data } = await supabase.from("instruments").select();
    setInstruments(data);
  }

  return (
    <ul>
      {instruments.map((instrument) => (
        <li key={instrument.name}>{instrument.name}</li>
      ))}
    </ul>
  );
}

export default App;