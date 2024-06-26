import React from 'react'

const NorthernOntario = () => {
    return (
        <>
            {/* Northern Ontario -------------    */}
            <div className="md:flex md:justify-between ">
                <div className="mb-4 md:mb-0 w-[200px] ">
                    <span className="flex items-center">
                        <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                            Northern Ontario
                        </span>
                    </span>
                </div>
                <div
                    className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 " // bg-gradient-to-t from-blue-50 shadow-lg p-4"
                >
                    <div>
                        <h2 className="mb-4 text-sm font-semibold  uppercase dark:text-white w-[200px] text-blue-600">
                            Description
                        </h2>
                        <ul className="text-gray-600 dark:text-gray-400">
                            <li className="mb-2">
                                <span className="">Total Budget</span>
                            </li>
                            <li className="mb-2">
                                <span className="">Total ON Costs</span>
                            </li>
                            <li className="mb-2">
                                <span className="">Total Labour</span>
                            </li>
                            <li className="mb-2">
                                <span className="">Total ON Labour</span>
                            </li>
                            <li>
                                <span className="">Total Northern ON Labour</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-4 text-sm font-semibold uppercase dark:text-white w-[130px] text-right text-blue-600">
                            Amount (
                            {convertCurrencyCode(production_Budget_Lst[0]?.currency_fid)})
                        </h2>

                        <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                            <li className="mb-2">
                                <span className=" text-right text-blue-600">
                                    {totalBudget.toLocaleString(0, "en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </span>
                            </li>
                            <li className="mb-2">
                                {totalONCosts.toLocaleString(0, "en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </li>
                            <li className="mb-2">
                                {totalLabour.toLocaleString(0, "en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </li>
                            <li className="mb-2">
                                {totalONLabour.toLocaleString(0, "en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </li>
                            <li>
                                {totalNortherONLabour.toLocaleString(0, "en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="mb-4 text-sm font-semibold uppercase dark:text-white w-[130px] text-right text-blue-600">
                            % of Total Costs
                        </h2>
                        <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                            <li className="mb-2">
                                <span className="">100%</span>
                            </li>
                            <li className="mb-2">
                                <span className="">{totalONCosts_Per}%</span>
                            </li>
                            <li className="mb-2">
                                <span className="">{totalLabour_Per}%</span>
                            </li>
                            <li className="mb-2">
                                <span className="">{totalONLabour_Per}%</span>
                            </li>
                            <li>
                                <span className="">{totalNortherONLabour_Per}%</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mb-4 md:mb-0">
                    <span className="flex items-center">
                        {/* <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-8" alt="FlowBite Logo" /> */}
                        {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span> */}
                    </span>
                </div>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />
        </>
    )
}

export default NorthernOntario