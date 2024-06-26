import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const ptax_calc_part_two_id = id;
  // GET method to get single records of tbl_ptax_calc_part_two table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_ptax_calc_part_two")
        .select()
        .eq("ptax_calc_part_two_id", ptax_calc_part_two_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_ptax_calc_part_two table
  if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("tbl_ptax_calc_part_two")
        .delete()
        .eq("ptax_calc_part_two_id", ptax_calc_part_two_id);

      error && res.status(401).json("Ptax_calc_part_two not deleted!");

      res.status(200).json("Ptax_calc_part_two deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_ptax_calc_part_two table
  if (method === "PUT") {
    const { ptax_calc_part_two, country_fid, is_active } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_ptax_calc_part_two")
        .update({ ptax_calc_part_two, country_fid, is_active })
        .eq("ptax_calc_part_two_id", ptax_calc_part_two_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
