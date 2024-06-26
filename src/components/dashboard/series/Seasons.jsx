import axiosInstance from '@/auth_services/instance';
import moment from 'moment';
import React, { useState, useEffect } from 'react'
import ActionBtnSeason from './ActionBtnSeason'
import InsertDataSeason from './InsertDataSeason';
import { updateProductionList } from "@/redux/productionSlice";
import { useDispatch } from "react-redux";

const Seasons = ({ data, menuCheck, state, productionId }) => {
    const dispatch = useDispatch();
    const { distributorLst, genreLst, provinceLst, countryLst, productions } = state;
    const [productionsList, setproductionsList] = useState(productions);
    const [productionList, setproductionList] = useState(productionsList);
    const [distributorList, setdistributorList] = useState(distributorLst);
    const [genreList, setgenreList] = useState(genreLst);
    const [provinceList, setprovinceList] = useState(provinceLst);
    const [open, setOpen] = useState(true)

    const handleChild = () => {
        setOpen(!open)
    }

    const sortseason = () => {
        const current_season = productionsList.filter((season) => season.parent_id == productionId)
        //console.log(current_season)
        return current_season
    }

    const [seasonLst, setseasonLst] = useState(sortseason())

    // convert distributor_fid to distributor real name
    function convetDistributorName(distributor_fid) {
        const distributor = distributorList.find(
            (item) => item.distributor_id === distributor_fid
        );
        return distributor?.distributor_name;
    }

    // convert genre_fid to genre real name
    function convetGenreName(genre_fid) {
        const genre = genreList.find((item) => item.genre_id === genre_fid);
        return genre?.genre;
    }

    // convert province_fid to province real name
    function convetProvince_fidName(province_fid) {
        const province = provinceList.find(
            (item) => item.province_id === province_fid
        );
        return province?.province;
    }


    const seasonReload = async () => {
        console.log(222)
        try {
            const { data, error } = await axiosInstance.get(process.env.API_SERVER + "production");
            dispatch(updateProductionList({ data }))
            setproductionsList(data)
            console.log(333)
            const current_season = data.filter((season) => season.parent_id == productionId)
            setseasonLst(current_season)

            console.log("current_season ", current_season)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        //console.log("season ",seasonLst)       
    }, [seasonLst])

    const tableReload = () => {
        console.log(111)
        seasonReload()
    }




    return (

        <table className="w-full text-sm text-left text-gray-900 dark:text-gray-400 border-3 border-solid"
            style={{ display: (open ? "all" : "none") }}>
            <thead className="text-xs text-gray-900 bg-gray-50 dark:bg-gray-700 dark:text-gray-700">
                {seasonLst.length > 0 && (
                    <tr>
                        <th scope="col" className="px-6 py-2">
                            Season
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Episodes
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Genre
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Disributor
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Incorporation Name
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Incorporation Date
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Incorporation In
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Province
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Action
                        </th>
                    </tr>
                )}
            </thead>
            <tbody>

                {seasonLst.map((season, index) => (
                    <tr key={season.production_id} className="bg-gray-0 border-b dark:bg-gray-800 dark:border-gray-700 text-xs" >
                        <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {season.season}
                        </th>
                        <td className="px-6 py-2">
                            {season.episode_cnt}
                        </td>
                        <td className="px-6 py-2">
                            {convetGenreName(season.genre_fid)}
                        </td>
                        <td className="px-6 py-2">
                            {convetDistributorName(season.distributor_fid)}
                        </td>
                        <td className="px-6 py-2">
                            {season.incorporation_name}
                        </td>
                        <td className="px-6 py-2">
                            {moment(season.incorporation_date).format("MMM Do, YYYY")}
                        </td>
                        <td className="px-6 py-2">
                            {season.Incorporation_in}
                        </td>
                        <td className="px-6 py-2">
                            {convetProvince_fidName(season.province_fid)}
                        </td>
                        <td className="px-6 py-2">
                            {menuCheck ? (
                                <ActionBtnSeason
                                    productionId={season.production_id}
                                    data={season}
                                    tableReload={tableReload}
                                    state={state}
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
                ))}

                <tr className="">
                    <th scope="row" className="px-6 pt-2">
                        {menuCheck ? (
                            <InsertDataSeason
                                tableReload={tableReload}
                                productionId={productionId}
                                state={{ distributorLst, genreLst, provinceLst, countryLst }}
                            />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 icon icon-tabler icon-tabler-square-letter-x" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                                <path d="M10 8l4 8"></path>
                                <path d="M10 16l4 -8"></path>
                            </svg>
                        )}

                    </th>
                </tr>
            </tbody>
        </table>

    )
}


export default Seasons