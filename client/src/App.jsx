import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import About from './pages/About';
import CreateListing from './pages/CreateListing';
import MyListings from './pages/MyListings';
import EditListing from './pages/EditListing';
import ListingDetails from './pages/ListingDetails'; // ✅ Import new page
import Search from './pages/Search';

import SimilarListings from './pages/SimilarListings';

import Header from './components/Header';
import Footer from './components/Footer';


const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/create" element={<CreateListing />} />
            <Route path="/mylistings" element={<MyListings />} />
            <Route path="/editlisting/:id" element={<EditListing />} />
            <Route path="/property/:id" element={<ListingDetails />} /> {/* ✅ New route */}
            <Route path="/similar/:id" element={<SimilarListings />} />

            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
