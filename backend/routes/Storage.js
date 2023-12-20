const { Router } = require('express');

const router = Router();

const ociOjectStorage = require('../utils/oracle');


/*
    * @route POST /str/addMedia
    * @desc Add media to the bucket
    * @access Private
    * @body token, MIMEtype, data
    * @return mediaId
    * @errors AM101, AM103, AM104, AM106, AM107

*/
router.post("/addMedia", async (req, res) => {
    const { token, MIMEtype, data } = req.body;

    // Check if the token exists
    if(!token) {
        return res.status(400).json({ code:"AM101", error: "Missing token" });
    }

    //TODO: Check if the token is valid
    const userID = "I101"

    // Check if the datatype eixsts and is of image/png or image/jpeg or image/gif
    if(!MIMEtype || (MIMEtype !== "image/png" && MIMEtype !== "image/jpeg" && MIMEtype !== "image/gif")) {
        return res.status(400).json({code:"AM103", error: "Missing or invalid MIMEtype" });
    }

    // Check if the request has the required data
    if(!data) {
        return res.status(400).json({code: "AM104", error: "Missing data" });
    }

    // Ensure data is in base64 format
    const base64Regex = /^data:([A-Za-z-+\/]+);base64,(.+)$/;
    if(!base64Regex.test(data)) {
        return res.status(400).json({AM: "AM106", error: "Data is not in base64 format" });
    }

    // Ensure data is less than 10MB
    const dataInBytes = Buffer.byteLength(data, 'base64');
    if(dataInBytes > 10485760) {
        return res.status(400).json({code: "AM107", error: "Data is too large" });
    }

    const bucketName = "B1";

    // Generate a random filename for the media uuid
    const fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const response = await ociOjectStorage.AddData(bucketName, fileName,MIMEtype ,data, { userID });

    if(response.versionId){
        res.json({code: "AM200", message: "Success", mediaId: fileName});
    } else {
        res.status(response.code).json(response);
    }
});

/*
    * @route POST /str/getMedia
    * @desc Get media from the bucket
    * @access Private
    * @body token, mediaId
    * @return MIMEtype, datalength ,data
    * @errors GM101, GM103, GM104, GM105
*/

router.post("/getMedia", async (req, res) => {
    const { token, mediaId } = req.body;

    // Check if the token exists
    if(!token) {
        return res.status(400).json({ code:"GM101", error: "Missing token" });
    }

    //TODO: Check if the token is valid
    const userID = "I101"

    // Check if the versionId exists
    if(!mediaId) {
        return res.status(400).json({code:"GM103", error: "Missing mediaID" });
    }

    const bucketName = "B1";

    const response = await ociOjectStorage.getData(bucketName, mediaId);

    if(response.opcMeta["opc-meta-userid"]!== userID){
        return res.json({code: "GM104", message: "Validation Failed", data: response.data});
    } 

    if(!response.eTag){
        return res.json({code: "GM105", message: "Data not found"});
    } else {
        let data =  await ociOjectStorage.generateStringFromStream(response.value);
        return res.json({code: "GM200", message: "Success", MIMEtype: response.contentType , datalength: response.contentLength , data: data});
    }

    
});

module.exports = router;

