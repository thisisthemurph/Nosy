import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await supabase.auth.api.setAuthCookie(req, res);
}
