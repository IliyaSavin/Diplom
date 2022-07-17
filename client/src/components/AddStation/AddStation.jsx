import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAllStationEcoBot,
  selectIsLoading,
  getEcoBotStations,
  selectPage,
  setPage,
  selectCityList,
  getCityList,
} from '../../redux/features/addStationSlice'
import Loader from '../Loader/Loader'
import Station from '../StationsPage/Station/Station'
import './AddStation.sass'
import { Select, Pagination } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { debounce } from 'lodash'

const { Option } = Select

function AddStation() {
  const [searchParams, setSearchParams] = useSearchParams({
    city: 'All',
  })
  const [searchString, setSearchString] = useState(
    searchParams.get('searchString') ?? ''
  )

  const dispatch = useDispatch()

  const allStations = useSelector(selectAllStationEcoBot)
  const isLoading = useSelector(selectIsLoading)
  const page = useSelector(selectPage)
  const cityList = useSelector(selectCityList)

  const debouncedSetString = debounce(() => {
    if (!searchString) {
      searchParams.delete('searchString')
    } else {
      searchParams.set('searchString', searchString)
    }
    setSearchParams(searchParams)
  }, 500)

  useEffect(() => {
    dispatch(getCityList())
  }, [dispatch])

  useEffect(() => {
    const search = `?${searchParams.toString()}`
    dispatch(getEcoBotStations(search))
  }, [searchParams, dispatch])

  useEffect(() => {
    debouncedSetString()

    return () => debouncedSetString.cancel()
  }, [searchString, debouncedSetString])

  const onChangePage = (page) => {
    dispatch(setPage(page))
    window.scrollTo(0, 0)
  }

  const onChangeSelect = (value) => {
    searchParams.set('city', value)
    setSearchParams(searchParams)
  }

  const onChangeSearchString = (e) => {
    setSearchString(e.target.value)
  }

  return (
    <>
      <div className='row gy-4 stations-nav align-items-center gx-2'>
        <div className='col-md-7 col-12 position-relative'>
          <input
            type='text'
            className='form-control stations-search'
            id='search'
            placeholder='Type station name ...'
            value={searchString}
            onChange={onChangeSearchString}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            color='#8cc541'
            className='stations-search-icon'
          />
        </div>
        <div className='col-md-5 col-12 ps-md-4 d-flex align-items-center justify-content-md-center justify-content-start'>
          <p className='nav-city mb-0 me-4'>City</p>
          <Select
            style={{ width: 170 }}
            onChange={onChangeSelect}
            defaultValue={searchParams.get('city')}
          >
            {cityList?.map((c, index) => (
              <Option key={index} value={c}>
                {c}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className='row pb-5'>
        <div className='col-12'>
          {isLoading && !allStations?.length ? (
            <div
              style={{ width: 'fit-content', marginTop: '20%' }}
              className='h-100 mx-auto'
            >
              <Loader />
            </div>
          ) : (
            <div className='row mt-4 gy-4'>
              {allStations
                ?.slice(
                  page === 1 ? 0 : (page - 1) * 10,
                  page === 1 ? 10 : page * 10
                )
                .map((station) => (
                  <Station addPage station={station} />
                ))}
            </div>
          )}
        </div>
      </div>
      {!isLoading && allStations?.length ? (
        <div className='row pb-5'>
          <div className='col-12 d-flex justify-content-center'>
            <Pagination
              current={page}
              total={allStations?.length}
              onChange={onChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default AddStation
