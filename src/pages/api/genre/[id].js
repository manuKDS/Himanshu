import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const genre_id = id;
  // GET method to get single records of tbl_genre table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_genre")
        .select()
        .eq("genre_id", genre_id);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // DELETE method to delete single record at tbl_genre table
  if (method === "DELETE") {
    try {
      const { error } = await supabase
        .from("tbl_genre")
        .delete()
        .eq("genre_id", genre_id);

      error && res.status(401).json("genre not deleted!");

      res.status(200).json("genre deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // UPDATE method to update single record at tbl_genre table
  if (method === "PUT") {
    const { genre, is_excluded, is_active, updated_by } = req.body;
    //console.log(genre, is_excluded, is_active, updated_by)
    try {
      const { data, error } = await supabase
        .from("tbl_genre")
        .update({ genre, is_excluded, is_active, updated_by })
        .eq("genre_id", genre_id)
        .select();

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
