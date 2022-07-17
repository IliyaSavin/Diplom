/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './StationsPage.sass'
import { Pagination, Select, Switch } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAdminConfig,
  getStations,
  selectConfig,
  selectLoading,
  selectLoadingStaus,
  selectPage,
  setGlobalStatusThunk,
  setPage,
} from '../../redux/features/stationsSlice'
import { debounce } from 'lodash'
import Station from './Station/Station'
import Loader from '../Loader/Loader'

const { Option } = Select

const StationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    order: 'idUp',
  })
  const [searchString, setSearchString] = useState(
    searchParams.get('searchString') ?? ''
  )

  const dispatch = useDispatch()
  const loadingStatus = useSelector(selectLoadingStaus)
  const loading = useSelector(selectLoading)
  const config = useSelector(selectConfig)
  const stations = useSelector((state) => state.stations.allStations)
  const page = useSelector(selectPage)

  const onChangeOrder = useCallback(
    (value) => {
      searchParams.set('order', value)
      setSearchParams(searchParams)
    },
    [setSearchParams]
  )

  const onChangePage = (page) => {
    dispatch(setPage(page))
    window.scrollTo(0, 0)
  }

  const onChangeSearchString = (e) => {
    setSearchString(e.target.value)
  }

  const debouncedSetString = debounce(() => {
    if (!searchString) {
      searchParams.delete('searchString')
    } else {
      searchParams.set('searchString', searchString)
    }
    setSearchParams(searchParams)
  }, 500)

  const onChangeSwitch = (checked) => {
    dispatch(setGlobalStatusThunk(+checked))
  }

  useEffect(() => {
    dispatch(setPage(1))
  }, [searchParams])

  useEffect(() => {
    debouncedSetString()

    return () => debouncedSetString.cancel()
  }, [searchString])

  useEffect(() => {
    dispatch(getAdminConfig())
  }, [])

  useEffect(() => {
    const search = `?${searchParams.toString()}`
    dispatch(getStations(search))
  }, [searchParams])

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
        <div className='col-md-5 col-12 ps-md-4'>
          <div className='row justify-content-lg-end justify-content-center align-items-center'>
            <div className='col-6'>
              <div
                style={{ width: 'fit-content' }}
                className='float-md-end float-start'
              >
                Global Status
                <Switch
                  loading={loadingStatus}
                  checked={!!config?.Working_Status}
                  onChange={onChangeSwitch}
                  className='ms-2'
                />
              </div>
            </div>
            <div className='col-6'>
              <Select
                className='float-md-end float-start'
                style={{ width: '130px' }}
                defaultValue={searchParams.get('order')}
                onChange={onChangeOrder}
              >
                <Option value='idDown'>Own</Option>
                <Option value='idUp'>Save EcoBot</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className='row pb-5'>
        <div className='col-12'>
          {loading && !stations?.length ? (
            <div
              style={{ width: 'fit-content', marginTop: '20%' }}
              className='h-100 mx-auto'
            >
              <Loader />
            </div>
          ) : (
            <div className='row mt-4 gy-4'>
              {stations
                .slice(
                  page === 1 ? 0 : (page - 1) * 10,
                  page === 1 ? 10 : page * 10
                )
                .map((station) => (
                  <Station station={station} />
                ))}
            </div>
          )}
        </div>
      </div>
      {!loading && stations?.length ? (
        <div className='row pb-5'>
          <div className='col-12 d-flex justify-content-center'>
            <Pagination
              current={page}
              total={stations?.length}
              onChange={onChangePage}
              showSizeChanger={false}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}

export default StationsPage
