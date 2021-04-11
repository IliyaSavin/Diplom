import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectAllStationEcoBot,
  selectIsLoading,
  getEcoBotStations,
  selectPage,
  setPage,
  selectCityList,
  getCityList,
} from '../../redux/features/addStationSlice';
import {setCurrentPageIndex} from '../../redux/features/stationsSlice';
import Loader from '../Loader/Loader';
import Station from './Station/Station';
import s from './AddStation.module.sass';
import {Input, Select, Switch, Pagination, Modal} from 'antd';

const {Search} = Input;
const {Option} = Select;
function AddStation() {
  const dispatch = useDispatch();

  const allStations = useSelector(selectAllStationEcoBot);
  const isLoading = useSelector(selectIsLoading);
  const page = useSelector(selectPage);
  const cityList = useSelector(selectCityList);

  let pageSize = 10;
  const [searchValue, setSearchValue] = useState('');
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);

  useEffect(() => {
    dispatch(setCurrentPageIndex(['3']));
    dispatch(getCityList());
  }, []);

  useEffect(() => {
    cityList &&
      dispatch(getEcoBotStations(`?city=${cityList[selectedCityIndex]}`));
  }, [cityList]);

  useEffect(() => {
    if (cityList !== undefined) {
      let string = searchValue
        ? `?searchString=${searchValue}&city=${cityList[selectedCityIndex]}`
        : `?city=${cityList[selectedCityIndex]}`;
      cityList && dispatch(getEcoBotStations(string));
    }
  }, [selectedCityIndex]);

  useEffect(() => {
    if (!searchValue && cityList !== undefined)
      dispatch(getEcoBotStations(`?city=${cityList[selectedCityIndex]}`));
  }, [searchValue]);

  let portionStation = allStations?.slice(page * 10 - 10, page * pageSize);

  useEffect(() => {
    if (allStations !== undefined) {
      portionStation = allStations.slice(page * 10 - 10, page * pageSize);
    }
  }, [page]);

  const onSearch = (value) => {
    setSearchValue(value);
    let string = searchValue
      ? `?searchString=${value}&city=${cityList[selectedCityIndex]}`
      : `?city=${cityList[selectedCityIndex]}`;
    dispatch(getEcoBotStations(string));
  };
  const handleChangeSelect = (value) => {};
  const onChangePage = (page, pageSize) => {
    dispatch(setPage(page));
    window.scrollTo(0, 0);
  };

  const onChangeSelect = (value) => {
    setSelectedCityIndex(value);
  };

  if (isLoading) return <Loader />;

  return (
    <div className={s.addStation}>
      <div className={s.header}>
        <div className={s.searchWrapper}>
          <Search
            placeholder='Search stations by name'
            onSearch={onSearch}
            className={s.search}
            value={searchValue}
            onChange={(e) => setSearchValue(e.currentTarget.value)}
          />
        </div>
        <div className={s.sortWrapper}>
          City
          <div>
            <Select
              style={{width: 170}}
              onChange={handleChangeSelect}
              className={s.select}
              onChange={onChangeSelect}
              defaultValue={selectedCityIndex}
            >
              {cityList?.map((c, index) => (
                <Option value={index}>{c}</Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className={s.stationWrapper}>
        {portionStation !== undefined &&
          portionStation.map((s) => <Station station={s} />)}
        <Pagination
          className={s.pagination}
          defaultCurrent={page}
          total={allStations?.length}
          onChange={onChangePage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}

export default AddStation;
