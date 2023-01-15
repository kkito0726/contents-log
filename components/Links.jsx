import classes from "./Links.module.css";
import { useState, useEffect } from "react";
import { url } from "../config/access.jsx";
import { Link } from "next/link";
import { v4 as uuidv4 } from "uuid";

export const Links = () => {
  const [categories, setCategories] = useState([]);
  const getCategory = async () => {
    const res = await fetch(`${url}/category`);
    const data = await res.json();
    const NAV_ITEMS = [{ href: "/", label: "すべて" }];
    data.map((cat) => {
      NAV_ITEMS.push({ href: `/${cat.category}`, label: `${cat.category}` });
    });
    console.log(NAV_ITEMS);
    setCategories([...NAV_ITEMS]);
  };
  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
      {categories.map((category, idx) => {
        return (
          <div className="header" key={uuidv4()}>
            <a key={idx} href={category.href}>
              {category.label}
            </a>
          </div>
        );
      })}
    </>
  );
};
