// Object API for Oracle Cloud Infrastructure
const oci_c = require('oci-common');
const oci_s = require('oci-objectstorage');

const configurationFilePath = "./src/api/helpers/oci-config";
const profile = "DEFAULT";

const provider = new oci_c.ConfigFileAuthenticationDetailsProvider(configurationFilePath, profile);

const objectStorageClient = new oci_s.ObjectStorageClient({
	authenticationDetailsProvider: provider,
	region: "uk-london-1",
});

// Generate a stream from a string
function generateStreamFromString(data)
{
	let Readable = require("stream").Readable;
	let stream = new Readable();
	stream.push(data); // the string you want
	stream.push(null);
	return stream;
}

// Generate a string from a stream
async function generateStringFromStream(stream)
{
	const chunks = [];
	const reader = stream.getReader();

	while (true)
	{
		const { done, value } = await reader.read();

		if (done)
		{
			break;
		}

		for (let i = 0; i < value.length; i++)
		{
			chunks.push(String.fromCharCode(value[i]));
		}
	}

	return chunks.join("");
}


// Get all buckets
const getBuckets = async () =>
{
	const request = {
		namespaceName: "lrr6fvwwjb9p",
		compartmentId: "ocid1.tenancy.oc1..aaaaaaaaji3lwlxyrbygb3tcsp4y3x2wr63zih77el7zs6nb3jypv33vgjya",
	};
	try
	{
		const response = await objectStorageClient.listBuckets(request);
		return response.items;
	} catch (error)
	{
		return { code: error.statusCode, error: error.message };
	}
};

// Add data to a bucket
const AddData = async (bucketName, fileName, MIMEtype, data, meta) =>
{
	const request = {
		namespaceName: "lrr6fvwwjb9p",
		bucketName: bucketName,
		objectName: fileName,
		putObjectBody: generateStreamFromString(data),
		contentType: MIMEtype,
		opcMeta: meta

	};
	try
	{
		const response = await objectStorageClient.putObject(request);
		return response;
	} catch (error)
	{
		return { code: error.statusCode, error: error.message };
	}
}

// Get data from a bucket using the mediaID (fileName)
const getData = async (bucketName, mediaID) =>
{
	const request = {
		namespaceName: "lrr6fvwwjb9p",
		bucketName: bucketName,
		objectName: mediaID
	};
	try
	{
		const response = await objectStorageClient.getObject(request);
		return response;
	} catch (error)
	{
		return { code: error.statusCode, error: error.message };
	}
}


//check which bucket is the file in
const getFileBucket = async (fileName) =>
{
	const buckets = await getBuckets();
	const bucket = buckets.find(bucket => bucket.name === fileName);
	return bucket;
}

// delete data from a bucket using the mediaID (fileName)
const deleteData = async (bucketName, mediaID) =>
{
	const request = {
		namespaceName: "lrr6fvwwjb9p",
		bucketName: bucketName,
		objectName: mediaID
	};
	try
	{
		const response = await objectStorageClient.deleteObject(request);
		return response;
	} catch (error)
	{
		return { code: error.statusCode, error: error.message };
	}
}

module.exports = { getBuckets, AddData, getData, getFileBucket, generateStreamFromString, generateStringFromStream, deleteData };
