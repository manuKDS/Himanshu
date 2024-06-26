import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import HeaderDropDown from "./HeaderDropDown";
import { useDispatch } from "react-redux";
import { assignProduction, updateProductionList } from "@/redux/productionSlice";
import RightMenu from "./RightMenu";
import { hasCookie, getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import axiosInstance from "@/auth_services/instance";

const Header = () => {
  //const userEmail = useSelector((state) => state.user.userInfo[0]?.email)
  const search_visible = useSelector(
    (state) => state.production.search_visible
  );
  const production_list = useSelector(
    (state) => state.production.production_list
  );
  // let getToken = getCookie("token");
  // let decodeUser = jwt.decode(getToken)
  //const [usersession, setusersession] = useState(email)
  const [production, setproduction] = useState([]);
  const [production_id, setproduction_id] = useState("");
  const [user, setuser] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    let validToken = hasCookie("token");

    if (!validToken) {
      //window.location.href = "/login";
    } else {
      fetchUserData();
    }

    const getProduction = async () => {
      const { data, error } = await axiosInstance.get(
        process.env.API_SERVER + "production"
      );
      dispatch(updateProductionList({ data }))
    };
    getProduction();
  }, []);

  const fetchUserData = async () => {
    let userToken = getCookie("token");
    const res = await axiosInstance.get(
      process.env.API_SERVER + "users/fetch_user_data/" + userToken
    );
    if (res.status === 201) {
      let decodeUser = jwt.decode(userToken);
      setuser({
        ...res.data,
        role: decodeUser?.role,
        organization: decodeUser?.organization,
      });
    }
  };

  useEffect(() => {
    const updateRedux = () => {
      dispatch(assignProduction({ production_id, production_name: convetproductionIdToName(production_id) }))
    }
    updateRedux()
  }, [production_id])

  useEffect(() => {
    if ((production_list.findIndex(e => e.production_id === production_id) === -1 || production_id == "") && production_list.length > 0) {
      setproduction_id(production_list[0].production_id);
    }
    setproduction(production_list);
  }, [production_list])

  const handleLogout = async () => {
    //const { error } = await supabase.auth.signOut()
    router.push("/login");
  };

  // CONVERT production_id to production
  function convetproductionIdToName(production_id) {
    const production1 = production.find(
      (item) => item.production_id == production_id
    );
    return production1?.production;
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet"
      />
      <div className="flex h-[72px] gap-2 items-center justify-between p-4 border-b border-t">
        <span className="text-2xl font-bold">
          <div className="relative flex items-center ml-2">
            {search_visible && (
              <HeaderDropDown
                state={{ production_id, setproduction_id }}
                list={production}
              />
            )}
          </div>
        </span>
        <div
          className="flex gap-10 cursor-pointer w-56" //className="w-[220px] flex gap-10 cursor-pointer"
        // onClick={handleLogout}
        >
          <RightMenu user={user} fetchUserData={fetchUserData} />
        </div>
      </div>
    </>
  );
};

//

export default Header;
