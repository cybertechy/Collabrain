const { Router } = require('express');
const { verifyUser } = require("../helpers/firebase");

const router = Router();

const ociOjectStorage = require("../helpers/oracle");


/*
	* @route POST
	* @desc Add media to the bucket
	* @access Private
	* @body token, MIMEtype, data
	* @return mediaId
	* @errors AM101, AM103, AM104, AM106, AM107

*/
router.post("/media", async (req, res) =>
{
	const { token, MIMEtype, data } = req.body;

	// Check if the token exists
	if (!token)
	{
		return res.status(400).json({ code: "AM101", error: "Missing token" });
	}

	//Check if the token is valid
	let user = await verifyUser(token)
	if (user === null)
	{	
		return res.status(403).json({ code: "AM102", error: "Invalid token" });
	}

	// Check if the datatype eixsts and is of image/png or image/jpeg or image/gif
	if (!MIMEtype || (MIMEtype !== "image/png" && MIMEtype !== "image/jpeg" && MIMEtype !== "image/gif"))
	{
		return res.status(400).json({ code: "AM103", error: "Missing or invalid MIMEtype" });
	}

	// Check if the request has the required data
	if (!data)
	{
		return res.status(400).json({ code: "AM104", error: "Missing data" });
	}

	// Ensure data is in base64 format
	const base64Regex = /^data:([A-Za-z-+\/]+);base64,(.+)$/;
	if (!base64Regex.test(data))
	{
		return res.status(400).json({ AM: "AM105", error: "Data is not in base64 format" });
	}

	// Ensure data is less than 10MB
	const dataInBytes = Buffer.byteLength(data, 'base64');
	if (dataInBytes > 10485760)
	{
		return res.status(400).json({ code: "AM106", error: "Data is too large" });
	}

	const bucketName = "B1";

	// Generate a random filename for the media uuid
	const fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

	const uid = user.uid;

	const response = await ociOjectStorage.AddData(bucketName, fileName, MIMEtype, data, {uid});

	if (response.versionId)
	{
		return res.json({ code: "AM200", message: "Success", mediaId: fileName });
	} else
	{
		return res.status(503).json({ code: "AM107", message: "Failed to add data" });
	}
});

/*
	* @route GET
	* @desc Get media from the bucket
	* @access Private
	* @body token, mediaId
	* @return MIMEtype, datalength ,data
	* @errors GM101, GM103, GM104, GM105
*/

router.get("/media/:mediaId", async (req, res) =>
{

	const token = req.query.token;
	const mediaId = req.params.mediaId;

	// Check if the token exists
	if (!token)
	{
		return res.status(400).json({ code: "GM101", error: "Missing token" });
	}

	//Check if the token is valid
	let user = await verifyUser(token)
	if (user === null)
	{
		return res.status(403).json({ code: "GM102", error: "Invalid token" });
	}

	// Check if the versionId exists
	if (!mediaId)
	{
		return res.status(400).json({ code: "GM103", error: "Missing mediaID" });
	}

	//ensure mediaid is have the required length
	if (mediaId.length < 20)
	{
		return res.status(400).json({ code: "GM103", error: "Invalid mediaID" });
	}

	const bucketName = "B1";

	const response = await ociOjectStorage.getData(bucketName, mediaId);

	if (response.code && response.code !== 200)
	{
		return res.status(404).json({ code: "GM105", message: "Data not found" });
	}

	if (response.opcMeta["opc-meta-uid"] !== user.uid)
	{
		return res.status(403).json({ code: "GM104", message: "Validation Failed", data: response.data });
	}

	if (!response.eTag)
	{
		return res.status(404).json({ code: "GM105", message: "Data not found" });
	} else
	{
		let data = await ociOjectStorage.generateStringFromStream(response.value);
		return res.status(200).json({ code: "GM200", message: "Success", MIMEtype: response.contentType, datalength: response.contentLength, data: data });
	}


});

module.exports = router;

