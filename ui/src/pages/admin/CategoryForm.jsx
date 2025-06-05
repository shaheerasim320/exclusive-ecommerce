import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from '../../components/AdminSidebar'
import { Icon } from "@iconify/react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, getCategoryByID, getDropDownMainCategories, updateCategory } from "../../slices/CategorySlice"
import useClickOutside from "../../components/useClickOutside"
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../components/Loader";

const fetchIcons = async (query) => {
  try {
    const response = await fetch(`https://api.iconify.design/search?query=${query}`);
    const data = await response.json();
    return data.icons || [];
  } catch (error) {
    console.error("Error fetching icons:", error);
    return [];
  }
};

const CategoryForm = () => {
  const location = useLocation();
  const url = location.pathname;
  const [searchParams] = useSearchParams();
  const edit = searchParams.has("update")
  const subCategory = url.includes("sub-category") || searchParams.has("subCategory");
  const [categoryID, setCategoryID] = useState(null)
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("mdi:shape-outline");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [iconList, setIconList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState("default")
  const [fieldsFilled, setFieldsFilled] = useState(true)
  const dispatch = useDispatch()
  const ref = useRef(null)
  useClickOutside(ref, () => setShowDropdown(false))
  const navigate = useNavigate()
  const { dropDownMainCategories, error, categoryDetail } = useSelector(state => state.category)

  useEffect(() => {
    if (subCategory) {
      dispatch(getDropDownMainCategories());
    }
  }, [subCategory]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setIconList([]);
      return;
    }

    fetchIcons(searchQuery).then((icons) => {
      setIconList(icons);
    });
  }, [searchQuery]);

  useEffect(() => {
    if (edit) {
      const categoryID = location?.state?.categoryID
      if (categoryID) {
        setCategoryID(categoryID)
        setLoading(true)
        dispatch(getCategoryByID({ categoryID }))
        setLoading(false)
      } else {
        subCategory ? navigate("/admin/sub-category") : navigate("/admin/category")
      }
    }
  }, [edit])

  useEffect(() => {
    if (error&& error !="Error in fetching sub categories" && error!="Error in fetching main categories") {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    if (categoryDetail && edit) {
      setName(categoryDetail.name)
      if (subCategory && categoryDetail.parentCategory != null) {
        setSelectedMainCategory(categoryDetail.parentCategory)
      }
      setSlug(categoryDetail.slug)
      setDescription(categoryDetail.description)
      setSelectedIcon(categoryDetail.icon)
    }
  }, [categoryDetail])

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s&']*$/.test(value)) {
      setName(value);
    }
  };

  const handleSlugChange = (e) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setSlug(value);
  };

  const handleSumbit = async () => {
    const allFiledFilled = subCategory ? name != "" && selectedMainCategory != "default" && slug != "" & selectedIcon != "mdi: shape - outline" : name != "" && slug != "" & selectedIcon != "mdi: shape - outline"
    setFieldsFilled(allFiledFilled)
    if (allFiledFilled && edit) {
      setLoading(true)
      await dispatch(updateCategory({ categoryID: categoryID, name: name, parentCategory: subCategory ? selectedMainCategory : null, slug: slug, description: description, icon: selectedIcon })).unwrap()
      setLoading(false)
      subCategory ? navigate("/admin/sub-category", { state: { message: "Sub Category updated successfully" } }) : navigate("/admin/category", { state: { message: "Category updated successfully" } })
    } else if (allFiledFilled) {
      setLoading(true)
      await dispatch(addCategory({ name: name, parentCategory: subCategory ? selectedMainCategory : null, slug: slug, description: description, icon: selectedIcon })).unwrap()
      setLoading(false)
      subCategory ? navigate("/admin/sub-category", { state: { message: "Sub Category added successfully" } }) : navigate("/admin/category", { state: { message: "Category added successfully" } })
    }
  }

  return (
    <div>
      {loading && <Loader />}
      <div className={`${loading ? "hidden" : "flex"}`}>
        <AdminSidebar />
        <div className="flex-1 p-4">
          <h1 className="text-[36px] font-bold">{edit ? "Edit" : "Add New"} {subCategory ? "Sub " : ""} Category</h1>
          <p className={`text-[#DB4444] my-[5px] ${!fieldsFilled ? "" : "invisible"}`}>{name != "" && slug != "" && subCategory ? selectedMainCategory != "default" : "" ? "Please select icon" : "Please fill out all details"}</p>
          <div className="form flex justify-between">
            <div className={`row-1 flex flex-col ${subCategory ? "gap-[24px]" : "gap-[62px]"} w-[45%]`}>
              {/* Name Field */}
              <div className="name flex flex-col">
                <label className="text-[#A6A6A6] font-[500]">Name<span className="text-[#DB4444] ml-[2px]">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="rounded-lg border border-[#CCC] py-[8px] px-[15px] "
                />
              </div>

              {/* Main Category Field */}
              <div className={`main-categories ${subCategory ? "flex flex-col" : "hidden"}`}>
                <label className="text-[#A6A6A6] font-[500]">Main Category<span className="text-[#DB4444] ml-[2px]">*</span></label>
                <select className="rounded-lg border border-[#CCC] py-[8px] px-[6px]" value={selectedMainCategory} onChange={(e) => setSelectedMainCategory(e.target.value)}>
                  <option value="default" disabled hidden >Select Main Category</option>
                  {dropDownMainCategories && dropDownMainCategories.map((category, index) => (
                    <option value={category.id} key={index}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Slug Field */}
              <div className="slug flex flex-col">
                <label className="text-[#A6A6A6] font-[500]">Slug<span className="text-[#DB4444] ml-[2px]">*</span></label>
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  className="rounded-lg border border-[#CCC] py-[8px] px-[15px]"
                />
              </div>
            </div>

            <div className="row-2 flex flex-col gap-[24px] w-[45%] ">
              {/* Description Field */}
              <div className="description flex flex-col">
                <label className="text-[#A6A6A6] font-[500]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-lg border border-[#CCC] py-[8px] px-[15px] h-[80px] resize-none"
                />
              </div>
              {/* Icon Selection */}
              <div className="icon-picker flex flex-col relative">
                <label className="text-[#A6A6A6] font-[500]">Select Icon<span className="text-[#DB4444] ml-[2px]">*</span></label>
                <div
                  className="relative flex items-center border border-gray-300 rounded-lg py-2 px-3  cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <Icon icon={selectedIcon} width="24" height="24" className="mr-2" />
                  <span>{selectedIcon.replace("mdi:", "")}</span>
                </div>

                {showDropdown && (
                  <div ref={ref} className="absolute bg-white border border-gray-300 shadow-lg rounded-lg mt-2  max-h-[200px] overflow-auto p-2 z-50">

                    {/* Search Box */}
                    <input
                      type="text"
                      placeholder="Search icons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md mb-2"
                    />

                    {/* Loading State */}
                    {loading && <div className="text-center text-gray-500">Loading...</div>}

                    {/* Icon List */}
                    {!loading && (
                      <div className="grid grid-cols-4 gap-3">
                        {iconList.length > 0 ? (
                          iconList.map((icon) => (
                            <div
                              key={icon}
                              className="flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setSelectedIcon(icon);
                                setShowDropdown(false);
                              }}
                            >
                              <Icon icon={icon} width="24" height="24" />
                              <span className="text-xs mt-1">{icon.replace("mdi:", "")}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500">No icons found</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <button className="bg-[#47b2ca] text-white p-[10px] rounded-full hover:bg-[#85bcca] w-[6.5rem] mt-[1rem]" onClick={handleSumbit}>
            {edit ? "Save" : "Submit"}
          </button>
        </div>
        <ToastContainer
          position="bottom-right" // Position of the toast message
          autoClose={3000} // Duration in milliseconds before toast disappears
          hideProgressBar={false} // Hide progress bar for simplicity
          closeOnClick={true} // Allow closing the toast by clicking
          pauseOnHover
        />
      </div>

    </div>
  );
};

export default CategoryForm;
