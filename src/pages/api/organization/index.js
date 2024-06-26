import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of tbl_organization table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_organization")
        .select()
        .order("org_name", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      //console.log(3)
      res.status(500).json(err);
    }
  }

  // POST method to insert record at expense_nature table
  if (method === "POST") {
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
      //console.log(expense_nature, is_active);
      const { data, error } = await supabase
        .from("tbl_organization")
        .insert({
          org_address,
          org_name,
          city_fid,
          website_url,
          icon,
          contact_no,
          email,
          zipcode,
        })
        .select();
      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      //console.log(err)
      res.status(500).json(err);
    }
  }
}
