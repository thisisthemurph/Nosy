import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader(
		"Set-Cookie",
		"sb-access-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
	);
	res.send({});
}
