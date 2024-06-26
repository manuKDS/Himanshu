import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const country_id = id;

  // UPDATE method to update single record at tbl_country table
  if (method === "PUT") {
    const { country, country_code, is_active } = req.body;
    console.log("Server-", country_id, country, country_code, is_active);

    try {
      const { data, error } = await supabase
        .from("tbl_country")
        .update({
          country: country,
          country_code: country_code,
          is_active: is_active,
        })
        .eq("country_id", country_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // GET method to get single records of tbl_country table
  if (method === "GET") {
    try {

      
      let { data, error } = await supabase
        .from("tbl_country")
        .select()
        .eq("country", country_id);
      //console.log("country", country_id);
      //console.log("data ", data);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_country table
  if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("tbl_country")
        .delete()
        .eq("country_id", country_id);

      error && res.status(401).json("Country not deleted!");

      res.status(200).json("Country deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
