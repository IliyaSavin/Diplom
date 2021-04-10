import moment from 'moment';

export const formatChartObject = (array, nameStation = false) => {
  const name = nameStation && nameStation;
  const done = [
    array.map((m) => {
      return {
        value: Math.ceil(m.Value),
        date: moment(m.Time).format('YYYY/MM/DD HH:mm'),
        name,
      };
    }),
  ];
  return done[0];
};

export const parseCommonUnits = (one, two) => {
  console.log(one, two);
  let array_second = [];
  let array = [];
  if (one.length > two.length) {
    array = one;
    array_second = two;
  } else {
    array = two;
    array_second = one;
  }
  let commonArray = [];

  if (array) {
    for (let x of array_second) {
      for (let y of array) {
        x.ID_Measured_Unit === y.ID_Measured_Unit && commonArray.push(x);
      }
    }
  }
  console.log(commonArray);
  return commonArray;
};
