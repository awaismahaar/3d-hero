/* eslint-disable react-refresh/only-export-components */
import { AnimatePresence, motion } from "framer-motion";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/MenuPage.style.css";
import transition from "../transition";
interface MenuPageProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MenuPage = ({ open, setOpen }: MenuPageProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="slide-in"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 0 }}
            exit={{ scaleX: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />

           <motion.div
            className="slide-out"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="full-menu">
            <ul className="menu-list">
              <li>
                <Link to="/" onClick={() => setOpen(false)}>
                  Home
                </Link>
              </li>

              <li>
                <Link to="/about" onClick={() => setOpen(false)}>
                  About
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MenuPage;
