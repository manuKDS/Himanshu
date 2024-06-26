// import { supabase } from "@/lib/supabaseClient";

// export default async function handler(req, res) {
//   const {
//     method,
//     query: { id },
//   } = req;
//   const tax_calc_part_one_id = id;
//   // GET method to get single records of tbl_tax_calc_part_one table
//   if (method === "GET") {
//     try {
//       let { data, error } = await supabase
//         .from("tbl_tax_calc_part_one")
//         .select()
//         .eq("tax_calc_part_one_id", tax_calc_part_one_id);

//       res.status(201).json(data);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }

//   // DELETE method to delete single record at tbl_tax_calc_part_one table
//   if (method === "DELETE") {
//     try {
//       const { error } = await supabase
//         .from("tbl_tax_calc_part_one")
//         .delete()
//         .eq("tax_calc_part_one_id", tax_calc_part_one_id);

//       error && res.status(401).json("tax_calc_part_one not deleted!");

//       res.status(200).json("tax_calc_part_one deleted successfully!");
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }

//   // UPDATE method to update single record at tbl_tax_calc_part_one table
//   if (method === "PUT") {
//     const { tax_calc_part_one, country_fid, is_active } = req.body;
//     try {
//       const { data, error } = await supabase
//         .from("tbl_tax_calc_part_one")
//         .update({ tax_calc_part_one, country_fid, is_active })
//         .eq("tax_calc_part_one_id", tax_calc_part_one_id)
//         .select();

//       res.status(200).json(data);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// }
