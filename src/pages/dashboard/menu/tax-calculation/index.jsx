import Layout from "@/components/dashboard/layout/Layout";
import axiosInstance from "@/auth_services/instance";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeVisible, menuCurrent } from "@/redux/productionSlice";
import jsPDF from "jspdf";

const TaxCalculation = ({
  production_list,
  genre_list,
  production_Budget_list,
  currency_list,
  nature_list,
  expense_list,
  city_lists,
  province_list,
  region_city,
  tax_calc_part_one,
  tax_calc_part_two,
  tax_regional_bonus,
  production_location_list,
  region_grant_list,
}) => {
  const dispatch = useDispatch();
  const search_visible = true;
  dispatch(changeVisible({ search_visible }))
  dispatch(menuCurrent({ active_menu: "tax-credit-calc" }))

  const productions_list = useSelector(
    (state) => state.production.production_list
  );

  const redux_production_id = useSelector(
    (state) => state.production.production_id
  );
  const production_Budget_Lst = production_Budget_list.filter(
    (item) => item.production_fid == redux_production_id
  );

  const production_Lst = production_list.filter(
    (item) => item.production_id == redux_production_id
  );
  //const [production, setproduction] = useState(production_Lst);
  //console.log("production_Lst ", production_Lst);
  const [prodBudgetList, setProdBudgetList] = useState(production_Budget_Lst);
  const [expenseList, setExpenseList] = useState(expense_list);
  const [natureList, setNatureList] = useState(nature_list);
  const [cityList, setCityList] = useState(city_lists);
  const [provinceList, setProvinceList] = useState(province_list);
  const [production_locationList, setproduction_locationList] = useState([]);
  // const [region_grantList, setregion_grantList] = useState(region_grant_list);

  const [pageEntries, setPageEntries] = useState(5);
  const [pageTotal, setPageTotal] = useState(1);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(5);
  const [direction, setDirection] = useState("start");
  const [query, setQuery] = useState("");
  const [errorMsg, seterrorMsg] = useState("Not Applicable");
  const [gta_cities, setgta_cities] = useState([]);
  const [bonus, setbonus] = useState(0);
  const [ofttc1, setofttc1] = useState(0);
  const [genre1, setgenre1] = useState("");

  //--------------------- Report Print ------------------------
  const reportTemplateRef = useRef(null);

  const handleGeneratePdf = () => {
    // const doc = new jsPDF({
    //   format: 'a4',
    //   unit: 'px',
    // });

    const doc = new jsPDF("p", "pt", "a3", true);
    //Adding the fonts.
    doc.setFont("Inter-Regular", "normal");

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save(
          "Tax credit report - " + convetproductionIdToName(redux_production_id)
        );
      },
    });
  };

  // CONVERT production_id to production
  function convetproductionIdToName(production_id) {
    const production1 = productions_list.find(
      (item) => item.production_id == production_id
    );
    return production1?.production;
  }
  //--------------------------------- Report End ----------------

  useEffect(() => {
    console.clear();
    console.log(
      "================+++++++++++++++++++++++++++++++++++===================="
    );
    const getList = () => {
      const production_Budget_Lst = production_Budget_list.filter(
        (item) => item.production_fid == redux_production_id
      );
      console.log("production_Budget_Lst  -- ", production_Budget_Lst);
      setProdBudgetList(production_Budget_Lst);

      const gtacity = region_city.filter((city) => city.region_fid == 16);
      // console.log("gtacity  -- ", gtacity)
      setgta_cities(gtacity);

      const prod_loca = production_location_list.filter(
        (item) => item.production_fid == redux_production_id
      );
      console.log("prod_loca  -- ", prod_loca);
      setproduction_locationList(prod_loca);
    };
    getList();
  }, [redux_production_id]);

  // console.log("fetch_production_location ", production_location_list);
  // console.log("redux_production_id -", redux_production_id);

  const tableReload = async () => {
    const res = await axiosInstance.get(
      process.env.API_SERVER + "production_budget"
    );
    if (res.status === 201) {
      const production_Budget_Lst = res.data.filter(
        (item) => item.production_fid == redux_production_id
      );
      setProdBudgetList(production_Budget_Lst);

      if (query !== "") {
        setPageCurrent(1);
        setDirection("start");
      }
      pageHandler();
    }
  };

  // convert currenct_id to currency_code
  function convertCurrencyCode(currency_id) {
    const currency = currency_list.find(
      (item) => item.currency_id === currency_id
    );
    return currency?.currency_code;
  }

  // convert genre_id to Genre_name
  function convertGenreId(genre_fid) {
    const genre = genre_list.find((item) => item.genre_id == genre_fid);
    return genre?.genre;
  }

  // convert city_id to city_name
  function convertCityId(city_id) {
    const city = cityList.find((item) => item.city_id === city_id);
    return city?.city;
  }

  // find province from city
  function findProvinceByCity(city_id) {
    const city = cityList.find((item) => item.city_id === city_id);
    return city?.province_fid;
  }

  // convert province_id to province
  function convertProvinceId(province_id) {
    const province = provinceList.find(
      (item) => item.province_id === province_id
    );
    return province?.province;
  }

  const filteredResults =
    query === ""
      ? prodBudgetList
      : prodBudgetList.filter((budget) => {
          return budget.expense_fid.toLowerCase().includes(query.toLowerCase());
        });

  // convert expense_id to expense_code
  function convertExpenseCode(exp_id) {
    const expense = expenseList.find((item) => item.expense_id === exp_id);
    return expense?.expense_code;
  }

  // find expense_nature_type_fid from tbl_expense column expense_type_fid
  function findExpenseNatureType(exp_id) {
    const expense = expenseList.find((item) => item.expense_id === exp_id);
    return expense?.expense_type_fid;
  }

  // convert exp_typeFid to expense_nature
  function convertExpenseNatureId(nature_id) {
    const nature = natureList.find(
      (item) => item.expense_nature_id === nature_id
    );
    return nature?.expense_nature;
  }

  const totalBudget = production_Budget_Lst.reduce(
    (n, { amount }) => n + amount,
    0
  );

  // tax calculation --------------------------
  var totalONCosts = 0;
  var totalLabour = 0;
  var totalONLabour = 0;
  var totalNortherONLabour = 0;

  production_Budget_Lst.map((item) => {
    const province_fid = findProvinceByCity(item.city_fid);
    const province = convertProvinceId(province_fid);

    if (province == "Ontario") {
      totalONCosts += item.amount;

      const exp_type_fid = findExpenseNatureType(item.expense_fid);
      const exp_nature = convertExpenseNatureId(exp_type_fid);
      if (exp_nature == "Labour") {
        totalONLabour += item.amount;
      }
    }

    const exp_type_fid = findExpenseNatureType(item.expense_fid);
    const exp_nature = convertExpenseNatureId(exp_type_fid);
    if (exp_nature == "Labour") {
      totalLabour += item.amount;

      region_city.map((city) => {
        if (city.city_fid == item.city_fid && city.region_fid == 13) {
          totalNortherONLabour += item.amount;
        }
      });
    }
  });

  const totalONCosts_Per = Math.round((totalONCosts * 100) / totalBudget);
  const totalLabour_Per = Math.round((totalLabour * 100) / totalBudget);
  const totalONLabour_Per = Math.round((totalONLabour * 100) / totalBudget);
  const totalNortherONLabour_Per = Math.round(
    (totalNortherONLabour * 100) / totalBudget
  );

  // NOHFC - tax_calc_part_one ------------------------
  var NOHFCCreditPer = 0;
  var max_credit_allowed = 0;
  var maxNOHFCAllow = 0;

  tax_calc_part_one.map((item1) => {
    if (item1.province == "ON") {
      NOHFCCreditPer = item1.credit_percentage;
      max_credit_allowed = item1.max_credit_allowed;
      maxNOHFCAllow = item1.max_credit_allowed;
    }
  });

  //----------------- maxNOHFCAllow new code

  region_grant_list.map((regon_grant) => {
    if (
      regon_grant.region_fid == 13 &&
      totalNortherONLabour >= regon_grant.grant_from &&
      totalNortherONLabour <= regon_grant.grant_to
    ) {
      console.log(
        "regon_grant.region_fid ---- ",
        regon_grant.region_fid,
        regon_grant.grant_from,
        regon_grant.grant_to
      );

      NOHFCCreditPer = regon_grant.grant_percentage;
      max_credit_allowed = regon_grant.max_grant;
      maxNOHFCAllow = regon_grant.max_grant;
    }
  });

  //----------------------------------
  var maxNOHFCAssistance = Math.round(
    (totalNortherONLabour * NOHFCCreditPer) / 100
  );
  if (maxNOHFCAssistance > max_credit_allowed) {
    maxNOHFCAssistance = max_credit_allowed;
  }
  var NOHFC = Math.round((totalNortherONLabour * NOHFCCreditPer) / 100);

  if (NOHFC > max_credit_allowed) {
    NOHFC = max_credit_allowed;
  }
  const maxNOHFCAssistance_Per = Math.round(
    (maxNOHFCAssistance * 100) / totalBudget
  );
  const NOHFC_Per = Math.round((NOHFC * 100) / totalBudget);

  // OPSTC - tax_calc_part_two ------------------------

  var ONCostCredit = 0;
  tax_calc_part_two.map((item2) => {
    if (item2.province == "ON" && item2.tax_credit_name == "OPSTC") {
      ONCostCredit = item2.credit_percentage;
    }
  });

  const EligibleONCosts = Math.round(totalONCosts - NOHFC);
  const OPSTCAllCosts = Math.round((EligibleONCosts * ONCostCredit) / 100);

  const EligibleONCosts_Per = Math.round((EligibleONCosts * 100) / totalBudget);
  const OPSTCAllCosts_Per = Math.round((OPSTCAllCosts * 100) / totalBudget);

  // OFTTC - tax_calc_part_two ---------------------------------------------

  //1. Check whether the genre of the production is Documentary or not?

  // 2. If genre is documentary then do the following:

  // 2.1: 75% of the total spend should be in Ontario. To check this criteria sum all budget line items that have
  //      Ontario as a province and divide that by total budget. This percent should be greater than or equal to 75%. If not,
  //      display some kind of message on the tax credit calculation page to show the issue

  // 2.2: check whether the production type is series or feature

  // 2.2.1: if feature, check whether a) the number of location days in region "Outside GTA" is more than or equal to 5 and
  //      b) check whether the percent of location days in "Outside GTA" / Ontario Location days in greater than or equal to 85%.

  // 2.2.2 If both the criteria are satisfied than add a regional bonus of 10% to OFTTC calculation

  // 2.3.1 if series, check whether a) the number of location days in region "Outside GTA" is more than or equal to the
  //       number of episodes in that season and b) check whether the percent of location days in "Outside GTA" / Ontario
  //       Location days in greater than or equal to 85%.

  // 2.3.2 If both the criteria are satisfied than add a regional bonus of 10% to OFTTC calculation

  // 3. If the genre is drama then everything from 2.1 to 2.3.2 and add one more rule. check whether the total number of
  //    location days in Ontario divided by total number of location days is greater than or equal to 85%? If it is less
  //    than 85% then this production is not eligible for OFTTC.

  var ONLabourCredit = 0;
  var bonus_per = 0;

  tax_calc_part_two.map((item2) => {
    if (
      item2.province == "ON" &&
      item2.tax_credit_name == "OFTTC" &&
      totalONCosts_Per >= 75
    ) {
      ONLabourCredit = item2.credit_percentage;
    }
  });

  var production_genre = "";
  var genres = ["", "", ""];

  useEffect(() => {
    const getCalc = () => {
      console.log("------------------- OFTTC % ", ONLabourCredit);
      production_genre = convertGenreId(production_Lst[0]?.genre_fid);
      setgenre1(production_genre);
      genres = production_genre?.split(" ");

      console.log("production ", production_Lst);
      console.log("production.genre_fid ", production_Lst[0]?.genre_fid);
      console.log("production_genre ", production_genre);

      if (production_genre != undefined) {
        console.log(genres[0], genres[2]);

        //------------------ Documentary ---- 2
        if (
          genres[0]?.toLowerCase() == "documentary" ||
          genres[0]?.toLowerCase() == "drama"
        ) {
          console.log("documentary");
          // 2. If genre is documentary then do the following:

          // 2.1: 75% of the total spend should be in Ontario. To check this criteria sum all budget line items that have
          //      Ontario as a province and divide that by total budget. This percent should be greater than or equal to 75%. If not,
          //      display some kind of message on the tax credit calculation page to show the issue

          if (totalONCosts_Per >= 75) {
            console.log("more than 75% spent in Ontario - Eligible");
            seterrorMsg("more than 75% spent in Ontario - Eligible");

            //------------------ feature ---- 2.2.1
            // 2.2: check whether the production type is series or feature

            var total_shooting_days = 0;
            var gta_shooting_days = 0;
            var outsideGTA_days = 0;
            var outsideGTA_per = 0;

            var bonus_percentage = 0;
            var feature_min_days = 0;
            var feature_min_per = 0;
            var series_min_per = 0;

            tax_regional_bonus.map((item3) => {
              if (item3.province == "ON" && item3.tax_credit_name == "OFTTC") {
                bonus_percentage = item3.bonus_percentage;
                feature_min_days = item3.feature_min_days;
                feature_min_per = item3.feature_min_percentage;
                series_min_per = item3.series_min_percentage;
              }
            });

            if (genres[2]?.toLowerCase() == "feature") {
              console.log("feature");

              // 2.2.1: if feature, check whether a) the number of location days in region "Outside GTA" is more than or equal to 5 and
              //      b) check whether the percent of location days in "Outside GTA" / Ontario Location days in greater than or equal to 85%.
              // 2.2.2 If both the criteria are satisfied than add a regional bonus of 10% to OFTTC calculation

              production_locationList.map((item) => {
                var province_fid = findProvinceByCity(item.city_fid);
                if (province_fid == 83) {
                  total_shooting_days += item.shooting_days;

                  if (gta_cities.find((gta) => gta.city_fid == item.city_fid)) {
                    gta_shooting_days += item.shooting_days;
                  } else {
                    // outsideGTA_days += item.shooting_days;

                    // var province_fid = findProvinceByCity(item.city_fid)
                    // if (province_fid == 83) {
                    outsideGTA_days += item.shooting_days;
                    //}
                  }
                }
              });

              outsideGTA_per = (outsideGTA_days * 100) / total_shooting_days;

              console.log("total_shooting_days ", total_shooting_days);
              console.log("gta_shooting_days  ", gta_shooting_days);
              console.log("outsideGTA_days  ", outsideGTA_days);
              console.log("outsideGTA days % ", outsideGTA_per);

              if (
                outsideGTA_days >= feature_min_days &&
                outsideGTA_per >= feature_min_per
              ) {
                // tax_regional_bonus.map((item3) => {
                //   if (item3.province == "ON" && item3.tax_credit_name == "OFTTC") {
                //     bonus_per = item3.bonus_percentage;
                //     //ONLabourCredit += item3.bonus_percentage;
                //     console.log("Outside GTA Bonus % ", item3.bonus_percentage)
                //   }
                // });

                bonus_per = bonus_percentage;
                console.log(
                  "Outside GTA > 5 days and Outside GTA days > 85 % , total  " +
                    ONLabourCredit +
                    "% , bonus % " +
                    bonus_per
                );
              } else {
                console.log("Outside GTA < 5 days OR Outside GTA days < 85 %");
              }
            }
            //------------------ series ---- 2.3.1
            else if (genres[2]?.toLowerCase() == "series") {
              console.log("series");

              // 2.3.1 if series, check whether a) the number of location days in region "Outside GTA" is more than or equal to the
              //       number of episodes in that season and b) check whether the percent of location days in "Outside GTA" / Ontario
              //       Location days in greater than or equal to 85%.
              // 2.3.2 If both the criteria are satisfied than add a regional bonus of 10% to OFTTC calculation

              var episode_count = production_Lst[0].episode_cnt;
              console.log("episode_count = ", episode_count);

              production_locationList.map((item) => {
                var province_fid = findProvinceByCity(item.city_fid);
                if (province_fid == 83) {
                  total_shooting_days += item.shooting_days;

                  if (gta_cities.find((gta) => gta.city_fid == item.city_fid)) {
                    gta_shooting_days += item.shooting_days;
                  } else {
                    //outsideGTA_days += item.shooting_days;

                    // var province_fid = findProvinceByCity(item.city_fid)
                    // if (province_fid == 83) {
                    outsideGTA_days += item.shooting_days;
                    //}
                  }
                }
              });

              outsideGTA_per = (outsideGTA_days * 100) / total_shooting_days;

              console.log("total_shooting_days ", total_shooting_days);
              console.log("gta_shooting_days  ", gta_shooting_days);
              console.log("outsideGTA_days  ", outsideGTA_days);
              console.log("outsideGTA days % ", outsideGTA_per);

              if (
                outsideGTA_days >= episode_count &&
                outsideGTA_per >= series_min_per
              ) {
                // tax_regional_bonus.map((item3) => {
                //   if (item3.province == "ON" && item3.tax_credit_name == "OFTTC") {
                //     bonus_per = item3.bonus_percentage;
                //     //ONLabourCredit += item3.bonus_percentage;
                //     console.log("Outside GTA Bonus % ", item3.bonus_percentage)
                //   }
                // });
                bonus_per = bonus_percentage;
                console.log(
                  "Outside GTA > episode_count and Outside GTA days > 85 % , total  " +
                    ONLabourCredit +
                    "% , bonus % " +
                    bonus_per
                );
              } else {
                console.log(
                  "Outside GTA < episode_count days OR Outside GTA days < 85 %"
                );
              }
            }

            //------------------ drama ---- 3 -------------------------------
            if (genres[0]?.toLowerCase() == "drama") {
              console.log("drama");
              // 3. If the genre is drama then everything from 2.1 to 2.3.2 and add one more rule. check whether the total number of
              //    location days in Ontario divided by total number of location days is greater than or equal to 85%? If it is less
              //    than 85% then this production is not eligible for OFTTC.

              var totalNUM_Ontario_days = 0;
              var totalNUM_Ontario_days_per = 0;

              var episode_count = production_Lst[0].episode_cnt;
              console.log("episode_count = ", episode_count);

              production_locationList.map((item) => {
                //total_shooting_days += item.shooting_days;

                var city_fid = item.city_fid;
                var province_fid = findProvinceByCity(city_fid);

                if (province_fid == 83) {
                  total_shooting_days += item.shooting_days;
                  totalNUM_Ontario_days += item.shooting_days;
                }

                if (gta_cities.find((gta) => gta.city_fid == item.city_fid)) {
                  gta_shooting_days += item.shooting_days;
                } else {
                  //outsideGTA_days += item.shooting_days;

                  var province_fid = findProvinceByCity(item.city_fid);
                  if (province_fid == 83) {
                    outsideGTA_days += item.shooting_days;
                  }
                }
              });

              totalNUM_Ontario_days_per =
                (totalNUM_Ontario_days * 100) / total_shooting_days;

              console.log(
                "totalNUM_Ontario_days_per ",
                totalNUM_Ontario_days_per
              );

              outsideGTA_per = (outsideGTA_days * 100) / total_shooting_days;

              console.log("total_shooting_days ", total_shooting_days);
              console.log("gta_shooting_days  ", gta_shooting_days);
              console.log("outsideGTA_days  ", outsideGTA_days);
              console.log("outsideGTA days % ", outsideGTA_per);

              if (
                outsideGTA_days >= episode_count &&
                outsideGTA_days >= feature_min_days &&
                outsideGTA_per >= feature_min_per &&
                totalNUM_Ontario_days_per > 85
              ) {
                tax_regional_bonus.map((item3) => {
                  if (
                    item3.province == "ON" &&
                    item3.tax_credit_name == "OFTTC"
                  ) {
                    bonus_per = item3.bonus_percentage;
                    //ONLabourCredit += item3.bonus_percentage;
                    console.log("Outside GTA Bonus % ", item3.bonus_percentage);
                  }
                });
                console.log(
                  "outsideGTA_days >= episode_count && outsideGTA_days >= 5 && outsideGTA_per >= 85 , episode count = " +
                    episode_count +
                    ", " +
                    ONLabourCredit +
                    "% , bonus % " +
                    bonus_per
                );
              } else {
                console.log(
                  "outsideGTA_days < episode_count OR outsideGTA_days < 5 OR outsideGTA_per < 85 , episode count = " +
                    episode_count +
                    ", " +
                    ONLabourCredit +
                    "% , bonus % " +
                    bonus_per
                );
                seterrorMsg(
                  "Location days is less than 85% - not eligible OFTTC"
                );
              }
            }
          } else {
            ONLabourCredit = 0;
            console.log("less than 75% spent in Ontario - Not Eligible");
            seterrorMsg("Total spent in Ontario < 75%, not eligible.");
          }
        } else {
          seterrorMsg("not eligible OFTTC");
          ONLabourCredit = 0;
        }
      }
      console.log("---------- ++++++++++ --------- Bonus % ", bonus_per);
      setbonus(bonus_per);
    };
    getCalc();
  }, [production_Lst]);

  if (
    errorMsg == "not eligible OFTTC" ||
    errorMsg == "Total spent in Ontario < 75%, not eligible." ||
    errorMsg == "Location days is less than 85% - not eligible OFTTC"
  )
    ONLabourCredit = 0;
  ONLabourCredit = ONLabourCredit + bonus;
  //console.log('------------------- item44', ONLabourCredit)

  const EligibleONLabour = totalONLabour;

  const EligibleONLabour_Per = (EligibleONLabour * 100) / totalONCosts;
  const NOHFCAssistance = Math.round((NOHFC * EligibleONLabour_Per) / 100);
  const NOHFCAssistance_Per = Math.round((NOHFCAssistance * 100) / totalBudget);
  const NetEligibleONLabour = Math.round(EligibleONLabour - NOHFCAssistance);

  const NetEligibleONLabour_Per = Math.round(
    (NetEligibleONLabour * 100) / totalBudget
  );
  const OFTTC_Labour_Only = Math.round(
    (NetEligibleONLabour * ONLabourCredit) / 100
  );
  const OFTTC_Labour_Only_Per = Math.round(
    (OFTTC_Labour_Only * 100) / totalBudget
  );

  // CAVCO ---- OPSTC -----------------------------------------------------

  const TotalCosts_OPSTC_CREDIT_NOHFC =
    totalBudget - OPSTCAllCosts - maxNOHFCAssistance;
  const TotalCosts_OPSTC_CREDIT_NOHFC_Per =
    Math.ceil(TotalCosts_OPSTC_CREDIT_NOHFC * 100) / totalBudget;
  const OtherExclusions = 0;
  const Maximum_Per_of_Production_Costs = 60;
  const Total_Eligible_costs = Math.ceil(
    ((TotalCosts_OPSTC_CREDIT_NOHFC - OtherExclusions) *
      Maximum_Per_of_Production_Costs) /
      100
  );
  const Total_Eligible_costs_Per = (Total_Eligible_costs * 100) / totalBudget;
  const Credit_Per = 25;
  const OPSTC_All_Costs = Math.round((Total_Eligible_costs * 25) / 100);
  const OPSTC_All_Costs_Per = Math.round((OPSTC_All_Costs * 100) / totalBudget);

  const OFTTC_TotalCosts_CREDIT_NOHFC = totalBudget - OFTTC_Labour_Only - NOHFC;
  const OFTTC_TotalCosts_CREDIT_NOHFC_Per =
    Math.ceil(OFTTC_TotalCosts_CREDIT_NOHFC * 100) / totalBudget;
  const OFTTC_OtherExclusions = 0;
  const OFTTC_Maximum_Per_of_Production_Costs = 60;
  const OFTTC_Total_Eligible_costs = Math.ceil(
    ((OFTTC_TotalCosts_CREDIT_NOHFC - OtherExclusions) *
      Maximum_Per_of_Production_Costs) /
      100
  );
  const OFTTC_Total_Eligible_costs_Per =
    (OFTTC_Total_Eligible_costs * 100) / totalBudget;
  const OFTTC_Credit_Per = 25;
  const OFTTC_All_Costs = Math.round((OFTTC_Total_Eligible_costs * 25) / 100);
  const OFTTC_All_Costs_Per = Math.round((OFTTC_All_Costs * 100) / totalBudget);

  const Total_Labour = totalLabour;
  const Total_Labour_Per = Math.round((Total_Labour * 100) / totalBudget);
  const Eligible_Labour = totalLabour;
  const Eligible_Labour_Per = Math.round((Eligible_Labour * 100) / totalBudget);
  const Max_Credit_Per = 25;
  const CAVCO_Credit_Labour = Math.round(
    (Eligible_Labour * Max_Credit_Per) / 100
  );
  const CAVCO_Credit_Labour_Per = Math.round(
    (CAVCO_Credit_Labour * 100) / totalBudget
  );

  // Summary -----------------------------------------------------------

  // Option 1
  const Option1_federal = OPSTC_All_Costs;
  const Option1_Province = OPSTCAllCosts;
  const Option1_Total = Option1_federal + Option1_Province;

  // Option 2
  const Option2_federal = OFTTC_All_Costs;
  const Option2_Province = OFTTC_Labour_Only;
  const Option2_Total = Option2_federal + Option2_Province;

  // Option 1 Or Option 2
  const Option_1_2_federal =
    OFTTC_All_Costs > OPSTC_All_Costs ? OPSTC_All_Costs : OFTTC_All_Costs;
  const Option_1_2_Province =
    OFTTC_Labour_Only > OPSTCAllCosts ? OFTTC_Labour_Only : OPSTCAllCosts;
  const Option_1_2_Total = Option_1_2_federal + Option_1_2_Province;

  // Option 3
  const Option3_federal = CAVCO_Credit_Labour;
  const Option3_Province =
    OPSTCAllCosts > OFTTC_Labour_Only ? OPSTCAllCosts : OFTTC_Labour_Only;
  const Option3_Total = Option3_federal + Option3_Province;

  // Suggested Option
  const sug_NHOHFC = NOHFC;
  const sug_Federal =
    Option_1_2_federal > Option3_federal ? Option3_federal : Option_1_2_federal;
  const sug_Provincial =
    Option_1_2_Province > Option3_Province
      ? Option3_Province
      : Option_1_2_Province;
  const sug_Total = sug_NHOHFC + sug_Federal + sug_Provincial;
  const sug_Total_Per = Math.round((sug_Total * 100) / totalBudget);

  //--------------------------------

  //console.log("prodBudgetList ", production_Budget_Lst)
  // Page Previous Next First Last
  useEffect(() => {
    pageHandler();
  }, [direction, pageCurrent]);

  // Change Entries 5, 10, 15, 20 per page
  useEffect(() => {
    setPageCurrent(1);
    setDirection("start");
    pageHandler();
  }, [pageEntries]);

  // Search input handler
  useEffect(() => {
    setPageCurrent(1);
    setDirection("start");
  }, [query]);

  const pageHandler = () => {
    var num1 = prodBudgetList.length / pageEntries;
    var num2 = Math.round(prodBudgetList.length / pageEntries);
    if (num1 > num2) {
      num2 = num2 + 1;
    }
    setPageTotal(num2);

    switch (direction) {
      case "prev":
        if (pageCurrent > 1) setPageCurrent(pageCurrent - 1);
        else setPageCurrent(1);
        break;
      case "next":
        if (pageCurrent < pageTotal) setPageCurrent(pageCurrent + 1);
        else setPageCurrent(pageTotal);
        break;
      case "start":
        setPageCurrent(1);
        break;
      case "end":
        setPageCurrent(pageTotal);
        break;
      default:
        //setPageCurrent(1)
        break;
    }

    setDirection("");
    var pgStart = pageEntries * (pageCurrent - 1);
    var pgEnd = pgStart + parseInt(pageEntries);
    setPageStart(pgStart);
    setPageEnd(pgEnd);
  };

  return (
    <div className="p-5 w-full">
      <div className="mx-auto w-full">
        <div className="flex justify-between gap-2 text-lg mb-4 w-full ">
          <span>Menu &gt; Tax Credit Calculation</span>

          {/* <button className="text-right px-6 py-2.5 bg-blue-500 text-white rounded-md" onClick={handleGeneratePdf}>
          Generate Pdf
        </button> */}

          <button
            className="ml-4 bg-green-500 hover:bg-blue-700 text-sm text-white font-bold py-2 px-8 rounded-xl"
            onClick={handleGeneratePdf}
          >
            Generate Pdf
          </button>
        </div>
      </div>

      <div
        ref={reportTemplateRef}
        className="p-4 bg-white sm:p-6 dark:bg-gray-800 rounded-xl w-[900px]"
      >
        <div className="mx-auto max-w-screen-xl text-xs">
          <div className="mb-8 md:mb-8 w-[200px] ">
            <span className="flex items-center">
              <span className="self-center text-[15px] font-semibold whitespace-nowrap dark:text-white text-stone-500">
                Tax - Credit Calculation Report:{" "}
                {convetproductionIdToName(redux_production_id)}
              </span>
            </span>
          </div>

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
                <h2 className="mb-4 text-xs font-semibold  uppercase dark:text-white w-[200px] text-blue-600">
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
                <h2 className="mb-4 text-xs font-semibold uppercase dark:text-white w-[130px] text-right text-blue-600">
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
              {/* <div>
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
              </div> */}
            </div>
            <div className="mb-4 md:mb-0">
              <span className="flex items-center">
                {/* <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-8" alt="FlowBite Logo" /> */}
                {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span> */}
              </span>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />

          {/* NOHFC Assistance -------------      */}
          <div className="md:flex md:justify-between ">
            <div className="mb-4 md:mb-0 w-[200px]">
              <span className="flex items-center ">
                <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                  NOHFC Assistance
                </span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[200px]"></h2>
                <ul className="text-gray-600 dark:text-gray-400">
                  <li className="mb-2">
                    <span className="">NOHFC Credit %</span>
                  </li>
                  <li className="mb-2">
                    <span className="">
                      Max NOHFC Assistance (
                      {convertCurrencyCode(
                        production_Budget_Lst[0]?.currency_fid
                      )}
                      )
                    </span>
                  </li>

                  <li>
                    <span className="">NOHFC</span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right"></h2>

                <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                  <li className="mb-2">
                    <span className=" text-right ">{NOHFCCreditPer}%</span>
                  </li>
                  <li className="mb-2">
                    {maxNOHFCAllow.toLocaleString(0, "en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </li>
                  <li>
                    {NOHFC.toLocaleString(0, "en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </li>
                </ul>
              </div>
              {/* <div>
                <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right"></h2>
                <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                  <li className="mb-2">
                    <span className="text-gray-100">-</span>
                  </li>
                  <li className="mb-2">
                    <span className="">
                      {maxNOHFCAssistance_Per.toFixed(0)}%
                    </span>
                  </li>

                  <li>
                    <span className="">{NOHFC_Per.toFixed(0)}%</span>
                  </li>
                </ul>
              </div> */}
            </div>
            <div className="mb-4 md:mb-0">
              <span className="flex items-center">
                {/* <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-8" alt="FlowBite Logo" /> */}
                {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span> */}
              </span>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />

          {/* ON Tax Credit Calc  -------------     */}
          <div className="md:flex md:justify-between ">
            <div className="mb-4 md:mb-0 w-[200px]">
              <span className="flex items-center ">
                <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                  ON Tax Credit Calc
                </span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[200px]"></h2>
                <ul className="text-gray-600 dark:text-gray-400">
                  <li className="mb-2 w-[200px]">
                    <span className=" ">
                      OPSTC (Ontorio Production Service Tax Credit)
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="">ON Cost Credit %</span>
                  </li>
                  <li className="mb-2">
                    <span className="">Eligible ON Costs</span>
                  </li>
                  <li className="mb-6">
                    <span className="">OPSTC / All Costs</span>
                  </li>
                  <li className="mb-2 w-[200px]">
                    <span className=" ">
                      OFTTC (Ontorio Film and Television Tax Credit)
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="">ON Labour Credit %</span>
                  </li>
                  <li className="mb-2">
                    <span className="">Eligible ON Labour</span>
                  </li>
                  <li className="mb-2">
                    <span className="">NOHFC Assistance(Labour Portion)</span>
                  </li>
                  <li className="mb-2">
                    <span className="">Net Eligible ON Labour</span>
                  </li>
                  <li className="mb-2">
                    <span className="">OFTTC / Labour Only</span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right"></h2>

                <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                  <li className="mb-6">
                    <span className=" text-right text-gray-100 ">-</span>
                  </li>
                  <li className="mb-2">
                    <span className=" text-right ">{ONCostCredit}%</span>
                  </li>
                  <li className="mb-2">
                    {EligibleONCosts.toLocaleString(0, "en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </li>

                  <li className="mb-6">
                    {OPSTCAllCosts.toLocaleString(0, "en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </li>

                  <li className="mb-6">
                    <span className=" text-right text-gray-100 ">-</span>
                  </li>
                  <li className="mb-2">
                    <span className=" text-right ">{ONLabourCredit}%</span>
                  </li>
                  <li className="mb-2">
                    {EligibleONLabour.toLocaleString(0, "en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </li>

                  <li className="mb-2">
                    {NOHFCAssistance.toLocaleString(0, "en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </li>
                  <li className="mb-2">
                    {NetEligibleONLabour.toLocaleString(0, "en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </li>

                  <li className="mb-2">
                    {OFTTC_Labour_Only.toLocaleString(0, "en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right"></h2>
                <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                  <li className="mb-6">
                    <span className="text-gray-100">-</span>
                  </li>
                  <li className="mb-2">
                    <span className="text-gray-100">-</span>
                  </li>
                  <li className="mb-2">
                    <span className="text-gray-100">
                      -{/* {EligibleONCosts_Per.toFixed(0)}% */}
                    </span>
                  </li>

                  <li className="mb-6">
                    <span className="text-gray-100">
                      -{/* {OPSTCAllCosts_Per.toFixed(0)}% */}
                    </span>
                  </li>

                  <li className="mb-6">
                    <span className="text-gray-100">
                      -
                      <span
                        className={
                          totalONCosts_Per < 75
                            ? "px-5 h-[45px] w-full text-black bg-red-300 rounded-md outline-none placeholder:text-gray-500"
                            : "px-5 h-[45px] w-full text-black bg-green-300 rounded-md outline-none placeholder:text-gray-500"
                        }
                      >
                        {totalONCosts_Per}%
                      </span>
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="">
                      {ONLabourCredit - bonus}% + {bonus}% Bonus
                    </span>
                  </li>
                  <li className="mb-2">
                    <span className="">
                      {/* {EligibleONLabour_Per.toFixed(0)}% */}
                    </span>
                  </li>

                  {/* <li className="mb-2">
                    <span className="">{NOHFCAssistance_Per.toFixed(0)}%</span>
                  </li>
                  <li className="mb-2">
                    <span className="">
                      {NetEligibleONLabour_Per.toFixed(0)}%
                    </span>
                  </li>
                  <li>
                    <span className="">
                      {OFTTC_Labour_Only_Per.toFixed(0)}%
                    </span>
                  </li> */}
                </ul>
              </div>
            </div>
            <div className="mb-4 md:mb-0">
              <span className="flex items-center">
                {/* <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-8" alt="FlowBite Logo" /> 
                  <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span> */}
              </span>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />

          {(errorMsg == "not eligible OFTTC" ||
            errorMsg == "Total spent in Ontario < 75%, not eligible." ||
            errorMsg ==
              "Location days is less than 85% - not eligible OFTTC") && (
            <p className="mb-2 text-left">
              <span className="text-red-500 font-bold">
                {genre1} - {errorMsg}
              </span>
              <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />
            </p>
          )}

          {errorMsg != "Total spent in Ontario < 75%, not eligible." && (
            <>
              {/* CAVCO Tax Credit Calc  -------------     */}
              <div className="md:flex md:justify-between ">
                <div className="mb-4 md:mb-0 w-[200px]">
                  <span className="flex items-center ">
                    <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                      CAVCO Tax Credit Calc
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  <div>
                    <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[200px]"></h2>
                    <ul className="text-gray-600 dark:text-gray-400">
                      <li className="mb-2 w-[200px]">
                        <span className=" ">OPSTC Options</span>
                      </li>
                      <li className="mb-2">
                        <span className="">
                          Total Costs - OPSTC Credit - NOHFC
                        </span>
                      </li>
                      <li className="mb-2">
                        <span className="">Other Exclusions</span>
                      </li>
                      <li className="mb-2">
                        <span className="">Maximum % of Production Costs</span>
                      </li>
                      <li className="mb-2 w-[200px]">
                        <span className=" ">Total Eligible costs</span>
                      </li>
                      <li className="mb-2">
                        <span className="">Credit %</span>
                      </li>
                      <li className="mb-12">
                        <span className="">
                          <b>OPSTC / All Costs</b>
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right"></h2>

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                      <li className="mb-2">
                        <span className=" text-right text-gray-100 ">-</span>
                      </li>
                      <li className="mb-2">
                        {TotalCosts_OPSTC_CREDIT_NOHFC.toLocaleString(
                          0,
                          "en-US",
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        )}
                      </li>

                      <li className="mb-2">{OtherExclusions}</li>

                      <li className="mb-2">
                        <span className=" text-right ">
                          {Maximum_Per_of_Production_Costs}%
                        </span>
                      </li>
                      <li className="mb-2">
                        <span className=" text-right ">
                          {Total_Eligible_costs.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
                      </li>
                      <li className="mb-2">{Credit_Per}%</li>
                      <li className="mb-12">
                        {OPSTC_All_Costs.toLocaleString(0, "en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </li>
                    </ul>
                  </div>
                  {/* <div>
                      <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right"></h2>
                      <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                        <li className="mb-2">
                          <span className="text-gray-100">-</span>
                        </li>
                        <li className="mb-2">
                          <span className="">
                            {TotalCosts_OPSTC_CREDIT_NOHFC_Per.toFixed(0)}%
                          </span>
                        </li>

                        <li className="mb-2">
                          <span className="text-gray-100">-</span>
                        </li>
                        <li className="mb-2">
                          <span className="text-gray-100">-</span>
                        </li>
                        <li className="mb-2">
                          <span className="">
                            {Math.round(Total_Eligible_costs_Per.toFixed(0))}%
                          </span>
                        </li>
                        <li className="mb-2">
                          <span className="text-gray-100">-</span>
                        </li>
                        <li className="mb-2">
                          <span className="">
                            {OPSTC_All_Costs_Per.toFixed(0)}%
                          </span>
                        </li>
                      </ul>
                    </div> */}
                </div>
                <div className="mb-4 md:mb-0">
                  <span className="flex items-center">
                    {/* <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-8" alt="FlowBite Logo" /> */}
                    {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span> */}
                  </span>
                </div>
              </div>
              {/* <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" /> */}

              {/* CAVCO Tax Credit Calc 2 -------------     */}
              <div className="md:flex md:justify-between ">
                <div className="mb-4 md:mb-0 w-[200px]">
                  <span className="flex items-center ">
                    <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                      CAVCO Tax Credit Calc 2
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  <div>
                    <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[200px]"></h2>
                    <ul className="text-gray-600 dark:text-gray-400">
                      <li className="mb-2">
                        <span className="">OFTTC Option</span>
                      </li>
                      <li className="mb-2">
                        <span className="">
                          Total Costs - OFTC Credit - NOHFC
                        </span>
                      </li>
                      <li className="mb-2">
                        <span className="">Other Exclusions</span>
                      </li>
                      <li className="mb-2">
                        <span className="">Maximum % of Production Costs</span>
                      </li>
                      <li className="mb-2">
                        <span className="">Total Eligible Costs</span>
                      </li>
                      <li className="mb-2">
                        <span className="">Credit %</span>
                      </li>
                      <li className="mb-2">
                        <span className="">
                          <b>OFTTC / Labour Only</b>
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right"></h2>

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                      <li className="mb-2">
                        <span className=" text-right text-gray-100 ">-</span>
                      </li>
                      <li className="mb-2">
                        {OFTTC_TotalCosts_CREDIT_NOHFC.toLocaleString(
                          0,
                          "en-US",
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        )}
                      </li>

                      <li className="mb-2">0</li>

                      <li className="mb-2">
                        <span className=" text-right ">
                          {OFTTC_Maximum_Per_of_Production_Costs}%
                        </span>
                      </li>
                      <li className="mb-2">
                        <span className=" text-right ">
                          {OFTTC_Total_Eligible_costs.toLocaleString(
                            0,
                            "en-US",
                            {
                              style: "currency",
                              currency: "USD",
                            }
                          )}
                        </span>
                      </li>
                      <li className="mb-2">{OFTTC_Credit_Per}%</li>
                      <li className="mb-12">
                        {OFTTC_All_Costs.toLocaleString(0, "en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </li>
                    </ul>
                  </div>
                  {/* <div>
                  <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right"></h2>
                  <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                    <li className="mb-2">
                      <span className="text-gray-100">-</span>
                    </li>
                    <li className="mb-2">
                      <span className="">
                        {OFTTC_TotalCosts_CREDIT_NOHFC_Per.toFixed(0)}%
                      </span>
                    </li>

                    <li className="mb-2">
                      <span className="text-gray-100">-</span>
                    </li>
                    <li className="mb-2">
                      <span className="text-gray-100">-</span>
                    </li>
                    <li className="mb-2">
                      <span className="">
                        {OFTTC_Total_Eligible_costs_Per.toFixed(0)}%
                      </span>
                    </li>
                    <li className="mb-2">
                      <span className="text-gray-100">-</span>
                    </li>
                    <li className="mb-2">
                      <span className="">
                        {OFTTC_All_Costs_Per.toFixed(0)}%
                      </span>
                    </li>
                  </ul>
                </div> */}
                </div>
                <div className="mb-4 md:mb-0">
                  <span className="flex items-center">
                    {/* <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-8" alt="FlowBite Logo" /> */}
                    {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span> */}
                  </span>
                </div>
              </div>
              {/* <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" /> */}

              {/* CAVCO Tax Credit Calc 3 -------------     */}
              <div className="md:flex md:justify-between ">
                <div className="mb-4 md:mb-0 w-[200px]">
                  <span className="flex items-center ">
                    <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                      CAVCO Tax Credit Calc 3
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  <div>
                    <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[200px]"></h2>
                    <ul className="text-gray-600 dark:text-gray-400">
                      <li className="mb-2">
                        <span className="">Labour Option</span>
                      </li>
                      <li className="mb-2">
                        <span className="">Total Labour</span>
                      </li>
                      <li className="mb-2">
                        <span className="">Eligible Labour</span>
                      </li>
                      <li className="mb-2">
                        <span className="">Max Credit % </span>
                      </li>
                      <li className="mb-2">
                        <span className="">CAVCO Credit (Labour) </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right"></h2>

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                      <li className="mb-2">
                        <span className=" text-right text-gray-100 ">-</span>
                      </li>
                      <li className="mb-2">
                        {Total_Labour.toLocaleString(0, "en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </li>

                      <li className="mb-2">
                        <span className=" text-right ">
                          {Total_Labour.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
                      </li>
                      <li className="mb-2">
                        <span className=" text-right ">
                          {Max_Credit_Per.toFixed(0)}%
                        </span>
                      </li>

                      <li className="mb-12">
                        {CAVCO_Credit_Labour.toLocaleString(0, "en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </li>
                    </ul>
                  </div>
                  {/* <div>
                  <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right"></h2>
                  <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                    <li className="mb-2">
                      <span className="text-gray-100">-</span>
                    </li>
                    <li className="mb-2">
                      <span className="">{Total_Labour_Per.toFixed(0)}%</span>
                    </li>

                    <li className="mb-2">
                      <span className="">
                        {Eligible_Labour_Per.toFixed(0)}%
                      </span>
                    </li>
                    <li className="mb-2">
                      <span className="text-gray-100">-</span>
                    </li>
                    <li className="mb-2">
                      <span className="">
                        {CAVCO_Credit_Labour_Per.toFixed(0)}%
                      </span>
                    </li>
                  </ul>
                </div> */}
                </div>
                <div className="mb-4 md:mb-0">
                  <span className="flex items-center">
                    {/* <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-8" alt="FlowBite Logo" /> */}
                    {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span> */}
                  </span>
                </div>
              </div>
              <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />

              {/* Tax CreditSummary Heading-------------     */}
              <div className="md:flex md:justify-between ">
                <div className="mb-4 md:mb-0 w-[200px]">
                  <span className="flex items-center ">
                    <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                      {" "}
                      Tax Credit Summary
                    </span>
                  </span>
                </div>
              </div>
              <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />

              {/* Tax CreditSummary Detail-------------   */}
              <div className="md:flex md:justify-between ">
                <div className="mb-4 md:mb-0 w-[200px]">
                  <span className="flex items-center ">
                    <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                      {" "}
                      Options 1:{" "}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[200px]"></h2> */}
                    <ul className="text-gray-600 dark:text-gray-400 w-[200px]">
                      <li className="mb-2">
                        <span className="">Fedral</span>
                      </li>
                      <li className="mb-2">
                        <span className="">Provincial</span>
                      </li>
                      <li className="mb-2">
                        <span className=""></span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right">

                </h2>  */}

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] ">
                      <li className="mb-2">
                        <span className="  ">OPSTC / All Costs</span>
                      </li>

                      <li className="mb-2">
                        <span className="  ">OPSTC / All Costs</span>
                      </li>
                      <li className="mb-2">
                        <span className="  ">OPSTC / All Costs</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right">

                </h2> */}

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                      <li className="mb-2">
                        {Option1_federal.toLocaleString(0, "en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </li>

                      <li className="mb-2">
                        <span className=" text-right ">
                          {Option1_Province.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
                      </li>
                      <li className="mb-2">
                        <span className=" text-right ">
                          {Option1_Total.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
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

              <div className="md:flex md:justify-between mt-6">
                <div className="mb-4 md:mb-0 w-[200px]">
                  <span className="flex items-center ">
                    <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                      {" "}
                      Options 2:{" "}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[200px]"></h2> */}
                    <ul className="text-gray-600 dark:text-gray-400 w-[200px]">
                      <li className="mb-2">Fedral</li>
                      <li className="mb-2">Provincial</li>
                      <li className="mb-2"></li>
                    </ul>
                  </div>

                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right">

                </h2>  */}

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] ">
                      <li className="mb-2">
                        <span className="  ">OFTTC / Labour Only</span>
                      </li>

                      <li className="mb-2">
                        <span className="  ">OFTTC / Labour Only</span>
                      </li>
                      <li className="mb-2">
                        <span className="  ">OFTTC / Labour Only</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right">
                </h2> */}

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                      <li className="mb-2">
                        {Option2_federal.toLocaleString(0, "en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </li>

                      <li className="mb-2">
                        <span className=" text-right ">
                          {Option2_Province.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
                      </li>
                      <li className="mb-2">
                        <span className=" text-right ">
                          {Option2_Total.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
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

              <div className="md:flex md:justify-between mt-6">
                <div className="mb-4 md:mb-0 w-[200px]">
                  <span className="flex items-center ">
                    <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                      {" "}
                      Options 1 or Option 2?{" "}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[200px]"></h2> */}
                    <ul className="text-gray-600 dark:text-gray-400 w-[200px]">
                      <li className="mb-2">Fedral</li>
                      <li className="mb-2">Provincial</li>
                      <li className="mb-2"></li>
                    </ul>
                  </div>

                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right">

                </h2>  */}

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] ">
                      <li className="mb-2">
                        <span className="  ">OFTTC / Labour Only</span>
                      </li>

                      <li className="mb-2">
                        <span className="  ">OFTTC / Labour Only</span>
                      </li>
                      <li className="mb-2">
                        <span className="  ">OFTTC / Labour Only</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right">
                </h2> */}

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                      <li className="mb-2">
                        {Option_1_2_federal.toLocaleString(0, "en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </li>

                      <li className="mb-2">
                        <span className=" text-right ">
                          {Option_1_2_Province.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
                      </li>
                      <li className="mb-2">
                        <span className=" text-right ">
                          {Option_1_2_Total.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
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

              <div className="md:flex md:justify-between mt-6">
                <div className="mb-4 md:mb-0 w-[200px]">
                  <span className="flex items-center ">
                    <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                      {" "}
                      Options 3:{" "}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[200px]"></h2> */}
                    <ul className="text-gray-600 dark:text-gray-400 w-[200px]">
                      <li className="mb-2">Fedral</li>
                      <li className="mb-2">Provincial</li>
                      <li className="mb-2"></li>
                    </ul>
                  </div>

                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right">

                </h2>  */}

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] ">
                      <li className="mb-2">
                        <span className="  ">Labour</span>
                      </li>

                      <li className="mb-2">
                        <span className="  ">Labour</span>
                      </li>
                      <li className="mb-2">
                        <span className="  "></span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right">
                </h2> */}

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                      <li className="mb-2">
                        {Option3_federal.toLocaleString(0, "en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </li>

                      <li className="mb-2">
                        <span className=" text-right ">
                          {Option3_Province.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
                      </li>
                      <li className="mb-2">
                        <span className=" text-right ">
                          {Option3_Total.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
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

              <div className="md:flex md:justify-between mt-6">
                <div className="mb-4 md:mb-0 w-[200px]">
                  <span className="flex items-center ">
                    <span className="self-center text-l font-semibold whitespace-nowrap dark:text-white text-blue-400">
                      {" "}
                      Suggested Option:{" "}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[200px]"></h2> */}
                    <ul className="text-gray-600 dark:text-gray-400 w-[200px]">
                      <li className="mb-2">-</li>
                      <li className="mb-2">-</li>
                      <li className="mb-2">Fedral</li>
                      <li className="mb-2">Provincial</li>
                      <li className="mb-2"></li>
                    </ul>
                  </div>

                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right">

                </h2>  */}

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] ">
                      <li className="mb-2">
                        <span className="  ">Applicable Tax Credit</span>
                      </li>
                      <li className="mb-2">
                        <span className="  ">NOHFC</span>
                      </li>

                      <li className="mb-2">
                        <span className="  ">OFTTC / Labour Only</span>
                      </li>
                      <li className="mb-4">
                        <span className="  ">OFTTC / Labour Only</span>
                      </li>
                      <li className="mb-2">
                        <b className=" text-right ">
                          {sug_Total_Per.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                          %
                        </b>
                      </li>
                    </ul>
                  </div>

                  <div>
                    {/* <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white w-[130px] text-right">
                </h2> */}

                    <ul className="text-gray-600 dark:text-gray-400 w-[130px] text-right">
                      <li className="mb-2">-</li>
                      <li className="mb-2">
                        {sug_NHOHFC.toLocaleString(0, "en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </li>

                      <li className="mb-2">
                        <span className=" text-right ">
                          {sug_Federal.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
                      </li>
                      <li className="mb-4">
                        <span className=" text-right ">
                          {sug_Provincial.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </span>
                      </li>
                      <li className="mb-2">
                        <b className=" text-right ">
                          {sug_Total.toLocaleString(0, "en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </b>
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
            </>
          )}
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-6" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              * Tax information are based on production data.
            </span>
            <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
              {/* <span className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" /></svg>
              </span> */}
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />
    </div>
  );
};

export async function getServerSideProps() {
  // 1. Fetching all data from tbl_production_budget
  const fetchProductionBudget = await axiosInstance.get(
    process.env.API_SERVER + "production_budget"
  );

  // 2. Fetching all data from tbl_currency
  const fetchCurrencyList = await axiosInstance.get(
    process.env.API_SERVER + "currency"
  );

  // 3. Fetching all data from tbl_expense
  const fetchExpenseList = await axiosInstance.get(
    process.env.API_SERVER + "expense"
  );

  // 4. Fetching all data from tbl_expense_nature
  const fetchExpenseNatureList = await axiosInstance.get(
    process.env.API_SERVER + "expense_nature"
  );

  // // 5. Fetching all data from tbl_vendor
  // const fetchVendorList = await axiosInstance.get(   process.env.API_SERVER + "vendor" );

  // 6. Fetching all data from tbl_city
  const fetchCityList = await axiosInstance.get(
    process.env.API_SERVER + "city"
  );

  // // 7. Fetching all data from tbl_country
  // const fetchCountryList = await axiosInstance.get(   process.env.API_SERVER + "country" );

  // 7. Fetching all data from tbl_province
  const fetchProvinceList = await axiosInstance.get(
    process.env.API_SERVER + "province"
  );

  // 8. Fetching all data from tbl_region_city
  const fetchregion_city = await axiosInstance.get(
    process.env.API_SERVER + "tax_region_city"
  );

  // 9. Fetching all data from tbl_tax_calc_part_one
  const fetchtax_calc_part_one = await axiosInstance.get(
    process.env.API_SERVER + "tax_calc_part_one"
  );

  // 10. Fetching all data from tbl_tax_calc_part_two
  const fetchtax_calc_part_two = await axiosInstance.get(
    process.env.API_SERVER + "tax_calc_part_two"
  );

  // 11. Fetching all data from tbl_tax_reional_bonus
  const fetchtax_regional_bonus = await axiosInstance.get(
    process.env.API_SERVER + "tax_regional_bonus"
  );

  const fetch_production = await axiosInstance.get(
    process.env.API_SERVER + "production"
  );

  const fetch_genre = await axiosInstance.get(process.env.API_SERVER + "genre");

  const fetch_production_location = await axiosInstance.get(
    process.env.API_SERVER + "production_location"
  );

  const fetch_region_grant = await axiosInstance.get(
    process.env.API_SERVER + "region_grant"
  );

  return {
    props: {
      genre_list: fetch_genre.data,
      production_list: fetch_production.data,
      production_Budget_list: fetchProductionBudget.data,
      expense_list: fetchExpenseList.data,
      nature_list: fetchExpenseNatureList.data,
      currency_list: fetchCurrencyList.data,
      city_lists: fetchCityList.data,
      province_list: fetchProvinceList.data,
      region_city: fetchregion_city.data,
      tax_calc_part_one: fetchtax_calc_part_one.data,
      tax_calc_part_two: fetchtax_calc_part_two.data,
      tax_regional_bonus: fetchtax_regional_bonus.data,
      production_location_list: fetch_production_location.data,
      region_grant_list: fetch_region_grant.data,
      // vendor_list: fetchVendorList.data,
      // country_list: fetchCountryList.data,
    },
  };
}

export default TaxCalculation;

TaxCalculation.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
