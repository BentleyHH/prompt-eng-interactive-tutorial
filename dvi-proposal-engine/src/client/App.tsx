import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Catalog from "./pages/Catalog";
import Proposals from "./pages/Proposals";
import ProposalNew from "./pages/ProposalNew";
import ProposalEditor from "./pages/ProposalEditor";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/proposals/new" element={<ProposalNew />} />
        <Route path="/proposals/:id" element={<ProposalEditor />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
