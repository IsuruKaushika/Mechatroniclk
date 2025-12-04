import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  // 🔥 NEW: Multiple expandable categories
  const [openCategories, setOpenCategories] = useState([]);

  const categoryStructure = [
    {
      name: "Passive Components",
      subs: [
        "Resistors",
        "Capacitors",
        "Inductors, Chokes & Coils",
        "Filters",
        "Frequency Control & Timing Devices",
        "Encoders",
        "Potentiometers, Trimmers & Rheostats",
        "Antenna Accessories",
        "Thermistors - NTC"
      ]
    },
    {
      name: "Active Components",
      subs: ["Diodes", "Transistors (BJT, MOSFET)", "Thyristors"]
    },
    {
      name: "Integrated Circuits (ICs)",
      subs: [
        "Microcontrollers",
        "Microprocessors",
        "Logic ICs",
        "Amplifiers",
        "Power Management"
      ]
    },
    {
      name: "Electromechanical",
      subs: ["Switches", "Relays", "Motors and Drivers", "Solenoids"]
    },
    {
      name: "Connectors",
      subs: [
        "Headers",
        "Terminal Blocks",
        "RF/Coaxial Connectors",
        "Cable Assemblies"
      ]
    },
    {
      name: "Development Tools",
      subs: ["Development Boards (Arduino, Raspberry Pi)", "Breadboards"]
    },
    {
      name: "Power Supplies",
      subs: [
        "AC Power Supplies",
        "DC Power Supplies",
        "AC/DC Converters",
        "DC/DC Converters",
        "Batteries",
        "Battery Holders",
        "Transformers"
      ]
    }
  ];

  // 🔥 New handler for multiple open categories
  const toggleCategoryOpen = (index) => {
    if (openCategories.includes(index)) {
      setOpenCategories(prev => prev.filter(i => i !== index));
    } else {
      setOpenCategories(prev => [...prev, index]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const selectSubCategory = (subName) => {
    if (subCategory.includes(subName)) {
      setSubCategory(prev => prev.filter(s => s !== subName));
    } else {
      setSubCategory(prev => [...prev, subName]);
    }
  };

  const sortProduct = () => {
    let fpcopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpcopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpcopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className='flex flex-col md:flex-row gap-1 sm:gap-10 pt-10'>

      {/* LEFT FILTER PANEL */}
      <div className='min-w-44 lg:min-w-60'>
        <p
          onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-1'
        >
          FILTERS
          <img className={`h-3 md:hidden transition ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} />
        </p>

        <div className={`border border-gray-300 pl-4 py-3 mt-6 ${showFilter ? '' : 'hidden'} md:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>

          <div className='flex flex-col gap-2'>
            {categoryStructure.map((cat, index) => (
              <div key={index}>
                
                {/* CATEGORY HEADER */}
                <div
                  onClick={() => toggleCategoryOpen(index)}
                  className='flex justify-between items-center cursor-pointer 
                             select-none text-sm font-medium text-gray-800'
                >
                  <span>{cat.name}</span>
                </div>

                {/* SUBCATEGORY LIST */}
                {openCategories.includes(index) && (
                  <div className='ml-4 mt-2 flex flex-col gap-1'>
                    {cat.subs.map((sub, i) => (
                      <label
                        key={i}
                        className='flex items-center gap-2 text-xs cursor-pointer py-1 px-1 
                                   rounded hover:bg-gray-100 text-gray-600'
                      >
                        <input
                          type="checkbox"
                          checked={subCategory.includes(sub)}
                          onChange={() => selectSubCategory(sub)}
                        />
                        {sub}
                      </label>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COMPONENTS'} />

          <select
            onChange={(e) => setSortType(e.target.value)}
            className='border-2 border-gray-300 text-sm px-2'
          >
            <option value='relavent'>Sort by: Relevant</option>
            <option value='low-high'>Sort by: Low to High</option>
            <option value='high-low'>Sort by: High to Low</option>
          </select>
        </div>

        {/* PRODUCT GRID */}
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              image={item.image}
              price={item.price}
              stockStatus={item.stockStatus}
              stock={item.stock}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
