import React from 'react';
import _ from 'lodash';

const SortCode = ({ data }) => {
  const [sortType, setSortType] = React.useState('asc');
  const [sortedData, setSortedData] = React.useState([]);

  React.useEffect(() => {
    const sorted = _.orderBy(data, ['name'], [sortType]);
    setSortedData(sorted);
  }, [data, sortType]);

  const handleSort = () => {
    const newSortType = sortType === 'asc' ? 'desc' : 'asc';
    setSortType(newSortType);
  };

  return (
    <table>
      <thead>
        <tr>
          <th onClick={handleSort}>Name</th>
          <th>Age</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.age}</td>
            <td>{item.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SortCode;
