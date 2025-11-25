import React from 'react'
import { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)

  // 👉 NEW: Search term state
  const [searchTerm, setSearchTerm] = useState("")

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')

      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )
      
      if (response.data.success) {
        toast.success(response.data.message)
        fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (e) {
      console.log(e)
      toast.error(e.message)
    }
  }

  const updateStock = async (productId, newStatus) => {
    if (isUpdating) return
    setIsUpdating(true)
    try {
      const response = await axios.post(
        backendUrl + '/api/product/updateStockStatus',
        { productId, stockStatus: newStatus },
        { headers: { token } }
      )
      
      if (response.data.success) {
        toast.success(response.data.message)
        fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (e) {
      console.log(e)
      toast.error(e.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const updateBestSeller = async (productId, isBestSeller) => {
    if (isUpdating) return
    setIsUpdating(true)

    try {
      const response = await axios.post(
        backendUrl + '/api/product/updateBestSeller',
        { productId, bestseller: !isBestSeller },
        { headers: { token } }
      )
      
      if (response.data.success) {
        toast.success(response.data.message)
        fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (e) {
      console.log(e)
      toast.error(e.message)
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const stockOptions = ['In Stock', 'Out of Stock', 'Limited Stock']

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return 'bg-green-500'
      case 'Out of Stock': return 'bg-red-500'
      case 'Limited Stock': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  // 👉 NEW: Filter products based on searchTerm
  const filteredList = list.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <p className='mb-2 text-lg font-semibold'>All Product List</p>

      {/* 👉 NEW: Search Bar */}
      <input
        type="text"
        placeholder="Search by name or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <div className='flex flex-col gap-2'>

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Best Seller</b>
          <b className='text-center'>Stock Status</b>
          <b className='text-center'>Delete</b>
        </div>

        {
          filteredList.map((item, index) => (
            <div 
              key={index}
              className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'
            >
              <img className='w-12' src={item.image[0]} alt=""/>
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>

              <div className='flex justify-center'>
                <button
                  onClick={() => updateBestSeller(item._id, item.bestseller)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    item.bestseller ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  disabled={isUpdating}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      item.bestseller ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className='text-right md:text-center'>
                <select
                  value={item.stockStatus}
                  onChange={(e) => updateStock(item._id, e.target.value)}
                  className={`px-2 py-1 rounded text-white cursor-pointer ${getStatusColor(item.stockStatus)}`}
                  disabled={isUpdating}
                >
                  {stockOptions.map(option => (
                    <option key={option} value={option} className="bg-white text-gray-800">
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <p onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-red-500 text-lg'>X</p>
            </div>
          ))
        }

        {filteredList.length === 0 && (
          <div className="py-4 text-center text-gray-500">
            No products match your search
          </div>
        )}

      </div>
    </>
  )
}

export default List
