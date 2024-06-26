import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of region city table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_region_city")
        .select()
        .order("created_at", { ascending: true });

      //error && res.status(500).json(error);
     // console.log(data)

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at region table
  if (method === "POST") {
    const { cityArray } = req.body;
    //console.log({region_fid, is_active, city_fid, modified_by})
    try {
      const { data, error } = await supabase
        .from("tbl_region_city")
        .insert(cityArray)
        .select();
      error && res.status(500).json(error);

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
