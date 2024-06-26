import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const org_id = id;
  // GET method to get single records of tbl_expense_nature table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_organization")
        .select()
        .eq("org_id", org_id);

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_expense_nature table
  if (method === "DELETE") {
    try {
      const { data, error } = await supabase
        .from("tbl_organization")
        .delete()
        .eq("org_id", org_id);

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_expense_nature table
  if (method === "PUT") {
    const {
      org_address,
      org_name,
      city_fid,
      website_url,
      icon,
      contact_no,
      email,
      zipcode,
    } = req.body;

    try {
      const { data, error } = await supabase
        .from("tbl_organization")
        .update({
          org_address,
          org_name,
          city_fid,
          website_url,
          icon,
          contact_no,
          email,
          zipcode,
        })
        .eq("org_id", org_id)
        .select();

      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
