import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setCurrentPageIndex} from '../../redux/features/stationsSlice';

function Report() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPageIndex(['5']));
  }, []);
  return (
    <div style={{width: 100 + '%', height: 100 + '%'}}>
      <iframe
        style={{width: 100 + '%', height: 100 + '%'}}
        src='https://app.powerbi.com/reportEmbed?reportId=c10ff309-9df0-4e38-ac91-be9aa397b994&autoAuth=true&ctid=d6599f68-2d2c-4cae-9ecf-60052b7d0bd9&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9'
        frameborder='0'
        allowFullScreen='true'
      ></iframe>
    </div>
  );
}

export default Report;
