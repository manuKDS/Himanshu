import { supabase } from "@/lib/supabaseClient";


export default async function handler(req, res) {
  const { method } = req;

  // GET method to get all records of menu table
  if (method === "GET") {
    try {
      let { data, error } = await supabase
        .from("tbl_menu")
        .select()
        .order("menu_id", { ascending: true });

      error && res.status(500).json(error);

      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  
}
