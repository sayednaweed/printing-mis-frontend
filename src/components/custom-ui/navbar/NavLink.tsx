import { motion } from "framer-motion";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

interface NavLinkProps {
  title: string;
  activeLink: string;
  time: number;
  to: string;
  setLink: (title: string) => void;
}
const NavLink = (props: NavLinkProps) => {
  const { title, activeLink, setLink, time, to } = props;
  const { t } = useTranslation();

  return (
    <Link to={to}>
      <motion.div
        initial={{ translateY: "0px" }}
        transition={{ duration: `0.${time}` }}
        whileInView={{ translateY: "0px" }}
        viewport={{ once: true }}
        onClick={() => setLink(title)}
        className={`z-10 text-[16px] relative rtl:text-2xl-rtl text-white/80 transition-border ease-in-out duration-1000 hover:cursor-pointer`}
      >
        {activeLink == title && (
          <motion.h1
            initial={{
              transform: "translateY(-32px)",
              opacity: 0,
            }}
            animate={{
              transform: "translateY(0px)",
              opacity: 1,
            }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-white absolute left-0"
          >
            {t(title)}
          </motion.h1>
        )}
        {activeLink == title ? (
          <motion.h1
            initial={{
              transform: "translateY(0px)",
              opacity: 1,
            }}
            animate={{
              transform: "translateY(32px)",
              opacity: 0,
            }}
            transition={{
              repeat: 0,
              repeatType: "reverse",
              duration: 0.22,
              ease: "easeInOut",
            }}
            className="text-white"
          >
            {t(title)}
          </motion.h1>
        ) : (
          t(title)
        )}
      </motion.div>
    </Link>
  );
};

export default NavLink;
