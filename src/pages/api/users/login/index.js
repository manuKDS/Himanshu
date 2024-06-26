import { supabase } from "@/lib/supabaseClient";
import CryptoJS from "crypto-js";
import { setCookie } from "cookies-next";
import { SignJWT } from "jose";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of users table
  if (method === "POST") {
    const { email, password } = req.body;
    try {
      let { data: user, error: user_error } = await supabase
        .from("tbl_users")
        .select("user_id, user_name, name, email, password, is_active")
        .eq("email", email);

      if (user.length===0) {
        res.status(201).json("Invalid user credential!");
      } else if(!user[0].is_active){
        res.status(201).json("Please connect with admin to gain access");
      } else {
        let bytes = CryptoJS.AES.decrypt(
          user[0].password,
          process.env.NEXT_PUBLIC_SECRET_KEY
        );

        let decryptedPass = bytes.toString(CryptoJS.enc.Utf8);

        if (email === user[0].email && password == decryptedPass) {
          let { data: user_role, error: user_role_error } = await supabase
          .from("tbl_role_user")
          .select("role_fid, is_active,roleData:tbl_role(is_active)")
          .eq("user_fid", user[0].user_id);

          if (user_role_error || user_role.length === 0 ) {
            res.status(201).json("Please connect with admin to gain access");
            return;
          }else if(!user_role[0]?.roleData?.is_active){
            res.status(201).json("Role is revoked. Please contact with admin.");
            return;
          }
          let role_fid = user_role[0]?.role_fid;

          let { data: user_org, error: user_org_error } = await supabase
            .from("tbl_user_organization")
            .select("organization_fid")
            .eq("user_fid", user[0].user_id);

          let organization_fid = user_org[0]?.organization_fid || 1 ;
          // if (user_org_error || user_org.length === 0) { //This is for organization will compalsary
          //   res.status(201).json("You do not belong to any organization");
          //   return;
          // }

          let { data: menu_role, error: menu_role_error } = await supabase
            .from("tbl_menu_role")
            .select("menu_fid, is_editable")
            .eq("role_fid", user_role[0].role_fid);

          if (menu_role_error || menu_role.length === 0) {
            res.status(201).json("Please connect with admin to gain access");
            return;
          }

          const alg = "HS256";

          const secret = new TextEncoder().encode(
            process.env.NEXT_PUBLIC_JWT_SECRET_KEY
          );

          const setJwtToken = async () => {
            const token = await new SignJWT({
              user_id: user[0].user_id,
              email: user[0].email,
              username: user[0].user_name,
              name: user[0].name,
              role: role_fid,
              organization: organization_fid,
              menurole: menu_role,
            })
              .setProtectedHeader({ alg })
              .sign(secret);

            setCookie("token", token, { req, res, maxAge: 60 * 60 * 60 });

            res.status(200).json(user);
          };

          setJwtToken();
        } else {
          res.status(201).json("Wrong user credentials!");
        }
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
}
