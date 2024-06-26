import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  const category_id = id;

  // UPDATE method to update single record at tbl_users table
  if (method === "PUT") {
    const { is_active } = req.body;
    try {
      const { data, error } = await supabase
        .from("tbl_expense_categories")
        .update({          is_active        })
        .eq("category_id", category_id)
        .select();

       // console.log(data)
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
