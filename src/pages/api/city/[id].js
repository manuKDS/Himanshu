import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const city_id = id;
  // GET method to get single records of tbl_city table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_city")
        .select()
        .eq("city_id", city_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_city table
  if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("tbl_city")
        .delete()
        .eq("city_id", city_id);

      error && res.status(401).json("City not deleted!");

      res.status(200).json("city deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_city table
  if (method === "PUT") {
    const { city, is_rural, province_fid, is_active } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_city")
        .update({ city, is_rural, province_fid, is_active })
        .eq("city_id", city_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
