import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from "@/api/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config/filterSortForm";
import studentContext from "@/context/student-context/studentContext";
import useAuthStore from "@/store/auth-store";
import { ArrowUpDownIcon, Search, SearchIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


function createSearchParamsHelper(filterParams) {
  const queryParams = []
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(',')
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
    }
  }
  return queryParams.join('&')
}


function StudentViewCoursesPage() {
  const [searchTerm, setSearchTerm] = useState(""); // Track the search term
  const [sort, setSort] = useState('price-lowtohigh')
  const [filters, setFilters] = useState([])
  const { studentViewCourseList,
    setStudentViewCourseList,
    loadingState, setLoadingState }
    = useContext(studentContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5; // Adjust the items per page as needed


  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = { ...filters, search: searchTerm }; // Pass the search term
    setSearchParams(new URLSearchParams(query), { replace: true });
    fetchAllStudentViewCourses(filters, sort, page, searchTerm);
  }


  async function fetchAllStudentViewCourses(filters, sort, page) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
      page: page,
      limit: itemsPerPage, // You can adjust the items per page dynamically if needed
      search: searchTerm, // Add search term to the query parameters
    });

    const response = await fetchStudentViewCourseListService(query);
    console.log(response);

    if (response?.success) {
      setStudentViewCourseList(response?.data);
      setTotalItems(response?.pagination.total); // Total number of items
      setTotalPages(response?.pagination.totalPages); // Total number of pages
      setLoadingState(false);

      // Ensure the page number is within bounds (in case filtering reduces total pages)
      if (page > response?.pagination.totalPages) {
        setPage(response?.pagination.totalPages);
      } else if (response?.pagination.totalPages > 0 && page === 0) {
        setPage(1); // Reset to page 1 if we have pages and we are at page 0
      }
    }
  }

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    // console.log(cpyFilters)
    
    const indeoxOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    
    // console.log(indeoxOfCurrentSection,getSectionId, getCurrentOption);

    if (indeoxOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
      console.log(cpyFilters);
    } else {
      const indeoxOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption.id);
      if (indeoxOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption.id);
      } else {
        cpyFilters[getSectionId].splice(indeoxOfCurrentOption, 1);
      }
    }
    setFilters(cpyFilters);
    sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    if (user) {
      const response = await checkCoursePurchaseInfoService(getCurrentCourseId, user.id);
      console.log(response, 'helloololo');
      if (response?.success) {
        console.log('Success:', response?.data);
        if (response?.data) {
          navigate(`/student/course-progress/${getCurrentCourseId}`);
        } else {
          navigate(`/course/details/${getCurrentCourseId}`);
        }
      } else {
        console.log('Failed to navigate, response not successful');
      }
    } else {
      navigate(`/course/details/${getCurrentCourseId}`);
    }
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters), { replace: true }); // 👈 This prevents extra history entries
  }, [filters]);

  useEffect(() => {
    setSort('price-lowtohigh');
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
  }, []);

  useEffect(() => {
    // Read page number from sessionStorage if available, otherwise default to 1
    const storedPage = sessionStorage.getItem('currentPage');
    if (storedPage) {
      setPage(Number(storedPage));
    }
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null) fetchAllStudentViewCourses(filters, sort, page,searchTerm);
  }, [filters, sort, page,searchTerm]);

  useEffect(() => {
    // Store the current page and filters in sessionStorage
    sessionStorage.setItem('currentPage', page);
    sessionStorage.setItem('filters', JSON.stringify(filters));
    return () => {
      sessionStorage.removeItem('filters');
      sessionStorage.removeItem('currentPage');
    };
  }, [page, filters]);


  // console.log(loadingState)
  // console.log(studentViewCourseList,'dassadasdsa')


  return (
    <div className='container mx-auto p-4' >
        <h1 className='text-3xl font-bold mb-4' >All Courses</h1>
      <div className='flex flex-col md:flex-row gap-4' >
        <aside className='w-full md:w-64 space-y-4 ' >
          <div  >
          <div className="flex">
              <input
                type="text"
                className="p-2 border rounded-lg rounded-r-none border-gray-300"
                placeholder="Search course"
                value={searchTerm}
                onChange={handleSearchChange} // Track search term
              />
              <button
                onClick={handleSearchSubmit} // Trigger search on submit
                className="bg-slate-300 p-2 rounded-lg rounded-l-none"
              >
                <SearchIcon />
              </button>
            </div>
        
            {
              Object.keys(filterOptions).map((keyItem, index) => (
                <div className='p-4 border-b ' key={index} >
                  <h3 className='font-bold mb-3 ' >{keyItem.toUpperCase()}</h3>
                  <div className='grid gap-2 mt-2' >
               
                    {
                      filterOptions[keyItem].map((option, index) => {
                        return <Label className='flex font-medium items-center
                                          gap-3' key={index}  >
                          <Checkbox checked={filters &&
                            Object.keys(filters).length > 0 &&
                            filters[keyItem] &&
                            filters[keyItem].indexOf(option.id) > -1
                          }
                            onCheckedChange={() => handleFilterOnChange(keyItem, option)} />
                          {option.label}
                        </Label>
                      })
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </aside>
        <main className='flex-1' >
          <div className='flex justify-end items-center mb-4 gap-5 ' >
            <DropdownMenu>
              <DropdownMenuTrigger asChild >
                <Button variant='outline' size='sm' className="flex items-center gap-2 p-5 "

                >
                  <ArrowUpDownIcon className='h-4 w-4' />
                  <span className='text-[16px] font-medium ' >Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]" >
                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)} >
                  {
                    sortOptions.map(sortItem =>
                      <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id} >
                        {sortItem.label}
                      </DropdownMenuRadioItem>)
                  }
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className='text-sm text-gray-900' >{totalItems} Result</span>
          </div>
          <div className='space-y-4 ' >

            {studentViewCourseList && studentViewCourseList.length > 0 ? (
              studentViewCourseList.map((courseItem, index) => {
                // Get cart data from localStorage
                const cartData = JSON.parse(localStorage.getItem("cartData")) || {};
                const cartKey = user ? user.id : "guest";
                const userCart = cartData[cartKey] || [];

                // Check if the course is already in the cart
                const isInCart = userCart.some((cartItem) => cartItem.courseId === courseItem.id);

                return (
                  <Card onClick={() => handleCourseNavigate(courseItem?.id)} className="cursor-pointer" key={courseItem?.id}>
                    <CardContent className="flex gap-4 p-4">
                      <div className="w-48 h-32 flex-shrink-0">
                        <img
                          src={courseItem?.image}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {courseItem?.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-1">
                          Created By{" "}
                          <span className="font-bold">{courseItem?.instructorName}</span>
                        </p>
                        <p className="text-[18px] text-gray-600 mb-2 mt-3">
                          {`${courseItem.lectures?.length} 
                  ${courseItem.lectures?.length <= 1 ? 'Lecture' : 'Lectures'} - 
                  ${courseItem?.level.toUpperCase()}`}
                        </p>

                        {/* Display "Already Bought" if the user owns it */}
                        {courseItem.studentCourses.some((el) => el.userId === user?.id) ? (
                          <p className="text-green-600">Already Bought</p>
                        ) : (
                          <p className="font-bold text-lg">
                            ${courseItem?.pricing}{" "}
                            {isInCart && <span className="text-yellow-600 text-sm">(Already in Cart)</span>}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <h1 className="font-extrabold text-4xl">No Courses Found</h1>
            )}

          </div>
        </main>
      </div>
      <div>
      </div>



      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          {/* Previous Button */}
          <button
            className={`px-4 py-2 border rounded ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200'}`}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>

          {/* Page Buttons with Ellipses */}
          {totalPages > 5 && page > 3 && (
            <>
              <button
                onClick={() => setPage(1)}
                className={`px-4 py-2 border rounded ${page === 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
              >
                1
              </button>
              <span className="px-4 py-2">...</span>
            </>
          )}

          {totalPages <= 5 ? (
            [...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-4 py-2 border rounded ${page === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))
          ) : (
            // Showing a range of pages based on the current page
            [...Array(5)].map((_, index) => {
              const pageIndex = page - 2 + index;
              if (pageIndex >= 1 && pageIndex <= totalPages) {
                return (
                  <button
                    key={pageIndex}
                    className={`px-4 py-2 border rounded ${page === pageIndex ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                    onClick={() => setPage(pageIndex)}
                  >
                    {pageIndex}
                  </button>
                );
              }
              return null;
            })
          )}

          {totalPages > 5 && page < totalPages - 2 && (
            <>
              <span className="px-4 py-2">...</span>
              <button
                onClick={() => setPage(totalPages)}
                className={`px-4 py-2 border rounded ${page === totalPages ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            className={`px-4 py-2 border rounded ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-200'}`}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
          <button
            onClick={() => setPage(totalPages)}
            className="px-4 py-2 border rounded hover:bg-gray-200"
          >
            Last
          </button>
        </div>
      )}


    </div>
  )
}

export default StudentViewCoursesPage