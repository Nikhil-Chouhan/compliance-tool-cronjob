import { StreamingBlobPayloadInputTypes } from "@smithy/types";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import https from "https";
import { fromIni, fromEnv } from "@aws-sdk/credential-providers";
import { HttpRequest } from "@smithy/protocol-http";
import {
  getSignedUrl,
  S3RequestPresigner,
} from "@aws-sdk/s3-request-presigner";
import { parseUrl } from "@smithy/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Hash } from "@smithy/hash-node";

const REGION = "ap-south-1";
const credentials = {
  accessKeyId: "AKIAVRH4WYCYI4AGQ4ZZ",
  secretAccessKey: "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",
};

const client = new S3Client({
  region: REGION,
  credentials: credentials,
});

const upload = async (Bucket: string, Key: string, Body: unknown) => {
  const body = Body as StreamingBlobPayloadInputTypes;
  const params = { Bucket, Key, Body: body };

  return await client.send(new PutObjectCommand(params));
};

const download = async (Bucket: string, Key: string) => {
  const command = new GetObjectCommand({
    Bucket: Bucket,
    Key: Key,
  });
  const result = await getSignedUrl(client, command, { expiresIn: 900 });
  if (!result) return "";
  return await result;
};

const download_without_client = async (Bucket: string, Key: string) => {
  const url = parseUrl(`https://${Bucket}.s3.${REGION}.amazonaws.com/${Key}`);
  const presigner = new S3RequestPresigner({
    credentials: credentials,
    region: REGION,
    sha256: Hash.bind(null, "sha256"),
  });

  const signedUrlObject = await presigner.presign(new HttpRequest(url));
  return formatUrl(signedUrlObject);
};

const getImageContentType = (key: string): string | null => {
  const extensionMatch = key.match(/\.\w+$/);
  if (extensionMatch) {
    const extension = extensionMatch[0].toLowerCase();
    const extensionToContentTypeMap: { [key: string]: string } = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".pdf": "application/pdf",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".doc": "application/msword",
    };
    return extensionToContentTypeMap[extension] || null;
  }
  return null;
};

const view = async (Bucket: string, Key: string) => {
  let contentType = getImageContentType(Key);
  if (!contentType) {
    contentType = "image/png";
  }

  const command = new GetObjectCommand({
    Bucket: Bucket,
    Key: Key,
    ResponseContentType: contentType,
    ResponseContentDisposition: "inline",
  });
  const result = await getSignedUrl(client, command, {
    expiresIn: 900,
    ResponseContentType: contentType,
    ResponseContentDisposition: "inline",
  });
  if (!result) return "";
  return await result;
};

export { upload, download, view, download_without_client };
