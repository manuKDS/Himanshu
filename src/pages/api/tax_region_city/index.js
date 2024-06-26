import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of region_city table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_region_city")
        .select()
      
        //.order("region_city_id", { ascending: true });

      //error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // POST method to insert record at region_city table
  // if (method === "POST") {
  //   const { array } = req.body;
  //   try {
  //     const { data, error } = await supabase
  //       .from("tbl_region_city")
  //       .insert(array)
  //       .select();
  //     error && res.status(500).json(error);

  //     res.status(200).json(data);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }
}