import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectAllStationEcoBot,
  selectIsLoading,
  getEcoBotStations,
  selectPage,
  setPage,
} from '../../redux/features/addStationSlice';
import {setCurrentPageIndex} from '../../redux/features/stationsSlice';
import Loader from '../Loader/Loader';
import Station from './Station/Station';
import s from './AddStation.module.sass';
import {Input, Select, Switch, Pagination} from 'antd';

const {Search} = Input;
const {Option} = Select;
function AddStation() {
  const dispatch = useDispatch();

  const allStations = useSelector(selectAllStationEcoBot);
  const isLoading = useSelector(selectIsLoading);
  const page = useSelector(selectPage);

  let pageSize = 10;
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    dispatch(setCurrentPageIndex(['3']));
    dispatch(getEcoBotStations('?city=Kyiv'));
  }, []);

  let portionStation = allStations?.slice(page * 10 - 10, page * pageSize);

  useEffect(() => {
    if (allStations !== undefined) {
      portionStation = allStations.slice(page * 10 - 10, page * pageSize);
    }
  }, [page]);
  console.log(portionStation);

  const onSearch = (value) => {};
  const handleChangeSelect = (value) => {};
  const onChangePage = (page, pageSize) => dispatch(setPage(page));

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
              style={{width: 120}}
              onChange={handleChangeSelect}
              className={s.select}
            ></Select>
          </div>
        </div>
      </div>
      <div className={s.stationWrapper}>
        {portionStation !== undefined && portionStation.map((s) => <Station />)}
        <Pagination
          defaultCurrent={page}
          total={allStations?.length}
          onChange={onChangePage}
        />
      </div>
    </div>
  );
}

export default AddStation;
