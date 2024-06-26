import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const tax_credit_type_id = id;
  // GET method to get single records of tbl_tax_credit_type table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_tax_credit_type")
        .select()
        .eq("tax_credit_type_id", tax_credit_type_id);

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_tax_credit_type table
  if (method === "DELETE") {
    try {
      const { data, error } = await supabase
        .from("tbl_tax_credit_type")
        .delete()
        .eq("tax_credit_type_id", tax_credit_type_id);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_tax_credit_type table
  if (method === "PUT") {
    const { app_type, province_fid, production_fid, org_fid } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_tax_credit_type")
        .update({ 
          app_type,
          // app_sub_type: appSubType,
          province_fid,
          // city_fid: cityId,
          org_fid,
          production_fid
         })
        .eq("tax_credit_type_id", tax_credit_type_id)
        .select();
  

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
