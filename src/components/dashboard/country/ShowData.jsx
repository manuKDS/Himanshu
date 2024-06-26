import React from 'react'

const ShowData = ( data ) => {
    return (
        <>
            <tr className="bg-white" key={data.country_id}>
                <td className="px-4 py-3 text-left ">{data.country}</td>
                <td className="px-4 py-3 text-left">
                    {data.country_code}
                </td>
                <td className="px-4 py-3 text-left">
                    {data.is_active ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3 text-left">
                    {moment(data.created_at).format("MMM Do, YYYY")}
                </td>
                <td className="px-4 py-3 text-left">
                    {menuCheck && countriesList ? (
                        <ActionBtn
                            countryList={countriesList}
                            countryId={data.country_id}
                            data={data}
                            tableReload={tableReload}
                            state={{}}
                        />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 icon icon-tabler icon-tabler-pencil-off" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M10 10l-6 6v4h4l6 -6m1.99 -1.99l2.504 -2.504a2.828 2.828 0 1 0 -4 -4l-2.5 2.5"></path>
                            <path d="M13.5 6.5l4 4"></path>
                            <path d="M3 3l18 18"></path>
                        </svg>
                    )}
                </td>
            </tr>
        </>
    )
}

export default ShowData