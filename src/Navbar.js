import React, { useState } from "react";
import { Link } from "react-router-dom";
import WalletDialog from "./WalletDialog";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/add-service">Add Service</Link>
      <Link to="/deploy-contract">Deploy Contract</Link>
      <button onClick={() => setOpen(true)}>Connect Wallet</button>

      {open && <WalletDialog onClose={() => setOpen(false)} />}
    </nav>
  );
}

export default Navbar;
